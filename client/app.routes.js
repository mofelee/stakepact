angular.module("app").run(['$rootScope', '$state', '$meteor', function($rootScope, $state, $meteor) {
  
  // watch the currentUser for changes and broadcast when currentUser logs in/out or changes ids
  $rootScope.$watch('currentUser', function(currentUser, previousState){
    if(currentUser && !$rootScope.subscriptionHandle){
      $meteor.subscribe('my_data').then(function(subscriptionHandle){
        $rootScope.subscriptionHandle = subscriptionHandle;
        $rootScope.$broadcast('currentUser');
      });
    }else if(!currentUser){
      $rootScope.subscriptionHandle = null;
      $rootScope.$broadcast('currentUser');
    }
  });

  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){ 
    console.log(event);
    console.log(toState);
    console.log(toParams);
    console.log(fromState);
    console.log(fromParams);
    console.log(error);

    // first check for authorization error
    // if unauthorized and logged in, go to 401
    // else go to signup and redirect after login
      // note: if user logs in after redirect and is still unauthorized, redirect to 401 page
    if(error.status === 401){
      if($rootScope.currentUser){
        $state.go('unauthorized');
      }else{
        $state.go('create.signup', {redirect_uri: $state.href(toState.name, toParams)}); 
      }
    }else{
      switch(toState.name) {
      case 'create.signup':
        if($rootScope.currentUser){
          $state.go('dashboard');
        }else{
          $state.go('create.commit');
        }
        break;
      case 'create.stakes':
        $state.go('create.commit');
        break;
      case 'create.notifications':
        $state.go('create.stakes');
        break;
      case 'create.dashboard':
        $state.go('create.commit');
        break;
      default :
        $state.go('404');
      }
    }
  });
}]);

angular.module("app").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $urlRouterProvider.when('/', '/commit');

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'client/dashboard/views/dashboard.ng.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboardctrl',
        resolve: {
          isAuthorized: function(authService){
            var response = authService.getLoginStatus();
            return response;
          },
          commitments: function($q, $meteor){
            var defer = $q.defer();
            $meteor.subscribe('my_commitments').then(function(subscriptionHandle){
              var commitments = $meteor.collection(Commitments, false);
              if(commitments.length > 0)
                defer.resolve(commitments);
              else
                defer.reject({status: 400, description: "no commitments found for user"});
            });
            return defer.promise;
          }
        }
      })
      .state('charities', {
        url: '/charities',
        abstract: true,
        template: '<ui-view/>'
      })
      .state('charities.list', {
        url: '',
        templateUrl: 'client/charities/views/charities-list.ng.html',
        controller: 'CharitiesListCtrl',
        controllerAs: 'charitieslistctrl',
        resolve: {
          isAuthorized: function(authService, adminRoles){
            return authService.getLoginStatus(adminRoles);
          }
        }
      })
      .state('charities.charity', {
        url: '/:charityId',
        templateUrl: 'client/charities/views/charity.ng.html',
        controller: 'CharityCtrl',
        controllerAs: 'charityctrl',
        resolve: {
          isAuthorized: function(authService){
            return authService.getLoginStatus();
          },
          charity: function(authService, subscriptionService, $stateParams, $q) {
            var defer = $q.defer();

            authService.getLoginStatus().then( function(){
              subscriptionService.subscribe("charities", true, "my_charities").then(function(){
                var charity = Charities.find($stateParams.charityId).fetch();
                if(charity && charity.length === 1) {
                  defer.resolve();
                } else {
                  defer.reject({status: 401, description: 'unauthorized'});
                }
              });
            });

            return defer.promise;
          }
        }
      })
      .state('register', {
        url: '/register',
        templateUrl: 'client/charities/views/register.ng.html',
        controller: 'RegisterCtrl',
        controllerAs: 'registerctrl',
        resolve: {
          isAuthorized: function(authService){
            return authService.getLoginStatus();
          }
        }
      })
      .state('create', {
        url: '',
        abstract: true,
        template: '<ui-view/>'
      })
      .state('create.commit', {
        url: '/commit?modify',
        templateUrl: 'client/create/views/commit.ng.html',
        controller: 'CommitCtrl',
        controllerAs: 'commitctrl',
        resolve: {
          commitment: function($stateParams, commitService){
            if($stateParams.modify){
              return commitService.setCommitment($stateParams.modify);
            }else{
              return commitService.getCommitment();
            }
          }
        }
      })
      .state('create.signup', {
        url: '/signup?redirect_uri&create_commitment',
        templateUrl: 'client/create/views/signup.ng.html',
        controller: 'SignupCtrl',
        controllerAs: 'signupctrl',
        resolve: {
          notLoggedIn: function($q, authService) {
            var defer = $q.defer();
            authService.getLoginStatus().then(function(currentUser){
              defer.reject({status: 400, description: 'user already logged in'});
            },
            function(error){
              defer.resolve();
            });
            return defer.promise;
          }
        }
      })
      .state('create.stakes', {
        url: '/stakes?modify',
        templateUrl: 'client/create/views/stakes.ng.html',
        controller: 'StakesCtrl',
        controllerAs: 'stakesctrl',
        resolve: {
          isAuthorized: function(authService){
            return authService.getLoginStatus();
          },
          commitment: function($q, $stateParams, commitService) {
            var defer = $q.defer();

            var commitment;
            if($stateParams.modify)
              return commitService.setCommitment($stateParams.modify);
            else
              commitment = commitService.getCommitment();
            
            if(commitment && commitment._id) {
              defer.resolve(commitment);
            }
            else {
              defer.reject({status: 400, description: "commitment not properly configured"});
            }

            return defer.promise;
          }
        }
      })
      .state('create.notifications', {
        url: '/notifications?modify',
        templateUrl: 'client/create/views/notifications.ng.html',
        controller: 'NotificationsCtrl',
        controllerAs: 'notificationsctrl',
        resolve: {
          isAuthorized: function(authService){
            return authService.getLoginStatus();
          },
          commitment: function($q, $stateParams, commitService) {
            var defer = $q.defer();

            var commitment;
            if($stateParams.modify)
              return commitService.setCommitment($stateParams.modify);
            else
              commitment = commitService.getCommitment();
            
            if(commitment && commitment._id) {
              defer.resolve(commitment);
            }
            else {
              defer.reject({status: 400, description: "commitment not properly configured"});
            }

            return defer.promise;
          }
        }
      })
      .state('unauthorized', {
        url: '/401',
        templateUrl: 'client/error/views/401.ng.html',
      })
      .state('404', {
        url: '/404',
        template: "<div>404</div>",
      });

    $urlRouterProvider.otherwise("/404");
  }]);
