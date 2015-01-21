<a ui-sref="create.stakes" class="text-uppercase">back</a>
<div class="row text-uppercase text-left">
  <h3 class="col-xs-offset-2 text-left primary-text">reminders</h3>
  <div class="row">
    <div class="col-xs-offset-2 col-xs-8 secondary-text">
      <div class="row">
        <div class="col-xs-2">
          <button class="btn primary-button col-xs-offset-2 col-xs-10" ng-click="notificationsctrl.reminders.enabled = !notificationsctrl.reminders.enabled;"><span class="glyphicon glyphicon-ok" ng-class="{accept: notificationsctrl.reminders.enabled}"></span></button>
        </div>
        <div class="col-xs-8">
          <p class="text-left tertiary-text">
            send me reminders to {{notificationsctrl.commitment.activity}}
          </p>
        </div>
      </div>
      <div class="row text-left" ng-show="notificationsctrl.reminders.enabled">
        <br>
        <div class="col-xs-offset-2 col-xs-10">
          <p class="tertiary-text">remind me: <span ng-class="{'notification-selector-selected': notificationsctrl.reminders.frequency === freq, 'notification-selector': notificationsctrl.reminders.frequency !== freq}" style="padding: 0.5vw;" ng-repeat="freq in notificationsctrl.frequencies" ng-click="notificationsctrl.reminders.frequency = freq"><b>{{freq}}</b></span></p>
          <div class="row text-center" ng-show="notificationsctrl.reminders.frequency === 'weekly'">
            <div class="col-xs-9">
              <p class="tertiary-text"><span ng-class="{'notification-selector-selected': notificationsctrl.reminders.times[$index].enabled, 'notification-selector': notificationsctrl.reminders.times[$index].enabled}" style="padding: 5px;" ng-repeat="day in notificationsctrl.days" ng-click="notificationsctrl.toggleRemindersTime($index)"><b>{{day}}</b></span></p>
            </div>
          </div>
          <div class="row">
            <label class="col-xs-1 tertiary-text text-left">time:</label>
            <input class="col-xs-1 text-uppercase text-right tertiary-text no-outline" style="font-weight: bold; padding-right: 0.5vw" type="text" placeholder="9" maxlength='2' ng-model="notificationsctrl.reminders.hour">
            <label class="col-xs-1 tertiary-text" style="padding-left: 0.5vw" ng-click="notificationsctrl.toggleRemindersAM()"><b>{{notificationsctrl.reminders.am && 'AM' || 'PM'}}</b></label>
          </div>
          <p class="tertiary-text">remind me by: 
            <span ng-class="{'notification-selector-selected': notificationsctrl.reminders.contactType === contactType, 'notification-selector': notificationsctrl.reminders.contactType !== contactType}" style="padding: 5px;" ng-repeat="contactType in notificationsctrl.contactTypes" ng-click="notificationsctrl.reminders.contactType = contactType"><b>{{contactType}}</b></span>
          </p>
          <div class="row" ng-show="notificationsctrl.reminders.contactType === 'text'">
            <label class="col-xs-4 tertiary-text text-left">phone number: </label>
            <input class="col-xs-7 text-uppercase text-left no-outline tertiary-text" style="font-weight: 700; padding-left: 0" type="tel" placeholder="number" ng-model="notificationsctrl.phoneNumber" maxlength="20">
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<br>
<br>
<br>

<div class="row text-uppercase text-left" ng-show="notificationsctrl.stakes">
  <h3 class="col-xs-offset-2 text-left primary-text">alerts</h3>
  <div class="row">
    <div class="col-xs-offset-2 col-xs-8 secondary-text">
      <div class="row">
        <div class="col-xs-2">
          <button class="btn primary-button col-xs-offset-2 col-xs-10" ng-click="notificationsctrl.alerts.enabled = !notificationsctrl.alerts.enabled;"><span class="glyphicon glyphicon-ok" ng-class="{accept: notificationsctrl.alerts.enabled}"></span></button>
        </div>
        <div class="col-xs-8">
          <p class="text-left tertiary-text">
            send me alerts when I fail to {{notificationsctrl.commitment.activity}} and I'm scheduled to donate to {{selectedCharity.name}}
          </p>
        </div>
      </div>
      <div class="row text-left" ng-show="notificationsctrl.alerts.enabled">
        <br>
        <div class="col-xs-offset-2 col-xs-10">
          <p class="tertiary-text">alert me: <span ng-class="{'notification-selector-selected': notificationsctrl.alerts.frequency === freq, 'notification-selector': notificationsctrl.alerts.frequency !== freq}" style="padding: 5px;" ng-repeat="freq in notificationsctrl.frequencies" ng-click="notificationsctrl.alerts.frequency = freq"><b>{{freq}}</b></span></p>
          <div class="row text-center" ng-show="notificationsctrl.alerts.frequency === 'weekly'">
            <div class="col-xs-9">
              <p class="tertiary-text"><span ng-class="{'notification-selector-selected': notificationsctrl.alerts.times[$index].enabled, 'notification-selector': notificationsctrl.alerts.times[$index].enabled}" style="padding: 5px;" ng-repeat="day in notificationsctrl.days" ng-click="notificationsctrl.toggleAlertsTime($index)"><b>{{day}}</b></span></p>
            </div>
          </div>
          <div class="row">
            <label class="col-xs-1 tertiary-text text-left">time: </label>
            <input class="col-xs-1 text-uppercase text-right tertiary-text no-outline" style="font-weight: bold; padding-right: 0.5vw" type="text" placeholder="9" maxlength='2' ng-model="notificationsctrl.alerts.hour">
            <label class="col-xs-1 tertiary-text" style="padding-left: 0.5vw" ng-click="notificationsctrl.toggleAlertsAM()"><b>{{notificationsctrl.alerts.am && 'AM' || 'PM'}}</b></label>
          </div>
          <p class="tertiary-text">alert me by: 
            <span ng-class="{'notification-selector-selected': notificationsctrl.alerts.contactType === contactType, 'notification-selector': notificationsctrl.alerts.contactType !== contactType}" style="padding: 5px;" ng-repeat="contactType in notificationsctrl.contactTypes" ng-click="notificationsctrl.alerts.contactType = contactType"><b>{{contactType}}</b></span>
          </p>

          <div class="row" ng-show="notificationsctrl.alerts.contactType === 'text'">
            <label class="col-xs-4 tertiary-text text-left">phone number: </label>
            <input class="col-xs-7 text-uppercase text-left no-outline tertiary-text" style="font-weight: 700; padding-left: 0" type="tel" placeholder="number" ng-model="notificationsctrl.phoneNumber" maxlength="20">
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<br>
<br>
<br>

<div class="row text-center">
  <button class="btn primary-button text-uppercase" ng-click="notificationsctrl.submit()">Complete</button>
</div>

<br>

<div class="row text-uppercase text-center tertiary-text">
  <p class="col-xs-offset-3 col-xs-6">*you can change these settings later if you're getting bugged too much, or not enough</p>
</div>
<br>