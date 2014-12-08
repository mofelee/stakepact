var wepay = Meteor.npmRequire('wepay').WEPAY;
var Future = Npm.require('fibers/future');

// local variables
var wepay_settings = Meteor.settings.wepay;

var wp = new wepay(wepay_settings);
wp.use_staging(); // use staging environment (payments are not charged)

Meteor.methods({
  createWePayAccount: function (charity, data) {

    // check for data
    if (!data || !data.code || !data.code.length) {
      throw new Meteor.Error("bad-request", "data argument isn't properly configured");
    } 

    // check for charity
    if (!charity){
      throw new Meteor.Error("bad-request", "charity argument isn't properly configured");
    }

    // find charity in mongo
    var charityObject = Charities.findOne({_id: charity});

    if(!charityObject){
      throw new Meteor.Error("bad-request", "charity not found");
    }

    // check for authorization to update charity
    var loggedInUser = Meteor.user();
    if (!loggedInUser ||
        !Roles.userIsInRole(loggedInUser, ['manage-users','admin']) || 
        !charityObject.owner || charityObject.owner != loggedInUser._id) {
      throw new Meteor.Error(403, "Access denied");
    }

    // don't allow unverified charities to have wepay accounts
    if(!charityObject.verified){
      throw new Meteor.Error("unauthorized", "charity must be verified before it can create a wepay account");
    }

    // don't allow charity to overwrite wepay account
    if(charityObject.wepay && charityObject.wepay.account_id){
      throw new Meteor.Error("bad-request", "charity already has wepay account");
    }

    // wepay requests are asynchronous, so we will create a future and wait to return or throw
    var fut = new Future();

    // get wepay oauth2 token
    wp.call('/oauth2/token', {
      'client_id': wepay_settings.client_id,
      'client_secret': wepay_settings.client_secret,
      'code': data.code,
      'redirect_uri': data.redirect_uri
    }, Meteor.bindEnvironment(  // bind the environment for wrapped async function with callback
      function(res, err){
        if(err){
          fut.throw(new Meteor.Error("oauth-failed", err));
        }

        try{
          var oauthResponse = JSON.parse(String(res));  // the response is a buffer that needs string conversion

          // call wepay account/create with new access_token
          createAccount(charityObject, Meteor.bindEnvironment(  // bind the environment for wrapped async function with callback
            function(createRes, err){
              if(err){
                fut.throw(new Meteor.Error("create-account-failed", err));
              }else{
                var createResponse = JSON.parse(String(createRes));

                if(createResponse.error){
                  fut.throw(new Meteor.Error("create-account-failed", createResponse));
                }else{
                  // update the charity mongo document with all the wepay details
                  updateCharityWithWepayAccount(charity, oauthResponse, createResponse, function(error, docs) {
                    if(error || !docs) {
                      console.log(error);
                      console.log(docs);
                      fut.throw(new Meteor.Error("charity-update-failed", "charity argument isn't properly configured"));
                    } else {
                      // everything worked -- account created. give yourself a high-five!
                      fut.return({status: 200});
                    }
                  });
                }
              }
            }));
        } catch (e){
          console.log("internal-error");
          console.log(e);
          fut.throw(new Meteor.Error("internal-error"));
        }
      }
    ));

    // wait until asynchronous calls return or throw
    return fut.wait();
  },

  createWePayPreapproval: function(stakes, commitment, charity) {
    if (!charity || !commitment || !commitment.commitmentString || !stakes || !stakes.ammount) {
      // throw new Meteor.Error("bad-request", "data argument isn't properly configured");
      throw Meteor.error("bad-request", "arguments not properly configured");
    } else {

      var fut = new Future();

      charityObject = Charities.findOne({_id: charity});
      if(!charityObject){
        throw Meteor.error("bad-request", "charity not found");
      }

      if(!charityObject.verified || !charityObject.wepay || !charityObject.wepay.account_id) {
        throw Meteor.error("bad-request", "charity not configured to accept donations");
      }

      console.log(charityObject);

      // call preapproval/create and return the validated iframe url
      wp.set_access_token(wepay_settings.access_token);
      wp.call('/preapproval/create', {
        account_id: charityObject.wepay.account_id,
        period: "weekly",
        short_description: commitment.commitmentString + "Stakes for your commitment: " + commitment.commitmentString,
        amount: stakes.ammount,
        fee_payer: "payee",
        mode: "iframe"
      }, Meteor.bindEnvironment(
        function(res, err){
          if(err){
            fut.throw(new Meteor.Error("preapproval-failed", err));
          }else{
            try{
              response = JSON.parse(String(res));
              console.log(response);
              fut.return(response);
            } catch(e) {
              console.log(e);
              fut.throw(new Meteor.Error('parse-failed'));
            }
          }
        }));

      return fut.wait();
    }
  },

  deleteWePayAccount: function(charity){
    if (!charity ) {
      // throw new Meteor.Error("bad-request", "data argument isn't properly configured");
      throw Meteor.error("bad-request", "arguments not properly configured");
    } else {

      charityObject = Charities.findOne({_id: charity});

      // check for charity
      if(!charityObject){
        throw Meteor.error("bad-request", "charity not found");
      }

      // check for authorization to update charity
      var loggedInUser = Meteor.user();
      if (!loggedInUser ||
          !Roles.userIsInRole(loggedInUser, ['manage-users','admin']) || 
          !charityObject.owner || charityObject.owner != loggedInUser._id) {
        throw new Meteor.Error(403, "Access denied");
      }

      // charity must have a wepay account that needs deletion
      if(!charityObject.wepay){
        throw new Meteor.Error("bad-request", "charity already has wepay account");
      }

      if(!charityObject.wepay.access_token || ! charityObject.wepay.account_id){
        throw new Meteor.Error("internal-error", "charity doesn't have properly configured wepay data");
      }

      var fut = new Future();

      var token = charityObject.wepay.access_token;
      var decryptedAccessToken = OAuthEncryption.isSealed(token) ? OAuthEncryption.open(token) : token;
      wp.set_access_token(decryptedAccessToken);
      wp.call('/account/delete', {
        account_id: charityObject.wepay.account_id
      }, Meteor.bindEnvironment(
        function(res, err){
          if(err){
            console.log(err);
            fut.throw(new Meteor.Error("wepay-deletion-failed", err));
          }else{
            try{
              response = JSON.parse(String(res));
              console.log(response);
              
              Charities.update({_id: charity}, { $unset: {
                wepay: {$exists: true}
              }}, function(error, docs){
                if(error || !docs) {
                  console.log(error);
                  console.log(docs);
                  fut.throw(new Meteor.Error("charity-update-failed", "failed to remove wepay"));
                } else {
                  // everything worked -- account deleted. give yourself a high-five!
                  fut.return({status: 200});
                }
              });

            } catch(e) {
              console.log(e);
              fut.throw(new Meteor.Error('parse-failed'));
            }
          }
        }));

      return fut.wait();
    }
  },
  getWePayUpdateURI: function(charity, redirect_uri, mode) {
    if (!charity) {
      // throw new Meteor.Error("bad-request", "data argument isn't properly configured");
      throw Meteor.error("bad-request", "arguments not properly configured");
    } else {

      charityObject = Charities.findOne({_id: charity});
      if(!charityObject){
        throw Meteor.error("bad-request", "charity not found");
      }

      // check for authorization to update charity
      var loggedInUser = Meteor.user();
      if (!loggedInUser ||
          !Roles.userIsInRole(loggedInUser, ['manage-users','admin']) || 
          !charityObject.owner || charityObject.owner != loggedInUser._id) {
        throw new Meteor.Error(403, "Access denied");
      }

      // charity must have a wepay account
      if(!charityObject.wepay){
        throw new Meteor.Error("bad-request", "charity already has wepay account");
      }

      if(!charityObject.wepay.access_token || ! charityObject.wepay.account_id){
        throw new Meteor.Error("internal-error", "charity doesn't have properly configured wepay data");
      }

      var fut = new Future();

      // configure call options
      var options = {account_id: charityObject.wepay.account_id};
      if(redirect_uri)
        options.redirect_uri = redirect_uri;
      if(mode)
        options.mode = mode;

      wp.set_access_token(wepay_settings.access_token);
      wp.call('/account/get_update_uri', options, Meteor.bindEnvironment(
        function(res, err){
          if(err){
            console.log(err);
            fut.throw(new Meteor.Error("wepay-update-uri-failed", err));
          }else{
            try{
              response = JSON.parse(String(res));
              console.log(response);
              
              // everything worked -- update uri retrieved. give yourself a high-five!
              fut.return(response);

            } catch(e) {
              console.log(e);
              fut.throw(new Meteor.Error('parse-failed'));
            }
          }
        }));

      return fut.wait();
    }
  }
});

function createAccount(charity, callback){
  wp.set_access_token(wepay_settings.access_token);
  wp.call('/account/create', {
    name: charity.name,
    description: charity.description? charity.description: (charity.name + ' basic account'),
    type: 'nonprofit'
  }, callback);
}

function updateCharityWithWepayAccount(charity, oauthResponse, createResponse, callback){
  var encryptedAccessToken = OAuthEncryption.seal(oauthResponse.access_token);

  Charities.update({_id: charity}, {
    $set: {
      wepay : {
        account_id: createResponse.account_id, 
        access_token: encryptedAccessToken
      }
    }
  }, callback);
}
