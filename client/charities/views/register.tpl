<div class="container">
  <div class="row text-uppercase tertiary-text">
    <form name="registrationForm" ng-submit="registerctrl.submit()" novalidate>
      <div class="col-xs-12">
        <div class="row text-center">
          <div class="col-xs-12">
            <h1 class="secondary-text">register charity</h1>
          </div>
        </div>
        <br>
        <div class="row">
          <label class="col-xs-6 text-right">primary contact name: </label>
          <input name="name" ng-model="name" class="col-xs-6 text-left tertiary-text no-outline" type="text" placeholder="NAME" required>
        </div>
        <div class="row" ng-class="{'input-error': registerctrl.submitted && registrationForm.email.$invalid}">
          <label class="col-xs-6 text-right">primary contact email: </label>
          <input name="email" ng-model="email" class="col-xs-6 text-left tertiary-text no-outline" type="email" placeholder="EMAIL" required>
        </div>
        <div class="row" ng-class="{'input-error': registerctrl.submitted && !registerctrl.isValidPhoneNumber(phone)}">
          <label class="col-xs-6 text-right">phone number: </label>
          <input name="phone" ng-model="phone" class="col-xs-6 text-left text-uppercase tertiary-text no-outline" type="text" placeholder="phone number" required>
        </div>
        <div class="row">
          <label class="col-xs-6 text-right">organization name: </label>
          <input name="organization" ng-model="organization" class="col-xs-6 text-left tertiary-text no-outline" type="text" placeholder="ORGANIZATION" required>
        </div>
        <div class="row">
          <label class="col-xs-6 text-right">website: </label>
          <input name="website" ng-model="website" class="col-xs-6 text-left tertiary-text no-outline" type="text" placeholder="WEBSITE" required>
        </div>
        <div class="row">
          <label class="col-xs-6 text-right">city: </label>
          <input name="city" ng-model="city" class="col-xs-6 text-left tertiary-text no-outline" type="text" placeholder="CITY" required>
        </div>
        <div class="row" ng-class="{'input-error': registerctrl.submitted && !registerctrl.isValidState(state)}">
          <label class="col-xs-6 text-right">state: </label>
          <input name="state" ng-model="state" class="col-xs-6 text-left text-uppercase tertiary-text no-outline" type="text" placeholder="state" required maxlength="2">
        </div>
        <div class="row" ng-class="{'input-error': registerctrl.submitted && !registerctrl.isValidEIN(ein)}">
          <label class="col-xs-6 text-right">ein: </label>
          <input name="ein" ng-model="ein" class="col-xs-6 text-left text-uppercase tertiary-text no-outline" type="text" placeholder="ein" maxlength="10" required>
        </div>
        <br>
        <div class="row text-center">
          <div class="col-xs-12">
            <button type="submit" class="btn primary-button text-uppercase" ng-disabled="!registrationForm.$valid" >submit</button>
          </div>
        </div>
        <br>
      </div>
    </form>
  </div>
  <div class="row text-center text-uppercase" ng-show="registerctrl.success">
    <div class="col-xs-12">
      <h3 class="tertiary-text"><b>your organization has been submitted for review</b></h3>
    </div>
    <div class="col-xs-offset-2 col-xs-8">
      <p style="font-size: 1vw">our team will contact you within the next 7 business days once we have verified that {{organization}} is a 501c3 registered with the I.R.S.</p>
    </div>
  </div>
</div>