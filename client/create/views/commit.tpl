<div class="row">
  <div class="col-xs-12">
    <form name="commitForm" class="text-uppercase text-center" ng-submit="commitctrl.submit()" novalidate>
      <div class="row">
        <h2 class="col-xs-12 text-center secondary-text" transit=" { $name: 'foo', left: '200px', $end: 'foo()' }">starting today,</h2>
        <h1 class="col-xs-12 text-center primary-text">i vow to</h1>
        <input name="activity" class="col-xs-12 text-uppercase text-center no-outline primary-text" type="text" placeholder="exercise" ng-model="tempActivity" ng-change="commitctrl.updateActivity()" required>
      </div>
      <div class="row">
        <div class="col-xs-offset-4 col-xs-4 text-center">
          <div ng-show="commitctrl.activity && !commitctrl.frequency">
            <ul class="text-center frequency-list">
              <li class="secondary-text" ng-repeat="f in commitctrl.frequencies" ng-click="commitctrl.setFrequency($index + 1)">{{f}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row">
        <div ng-show="commitctrl.activity && commitctrl.frequency" class="col-xs-12 text-center secondary-text">
          <span ng-click="commitctrl.frequency = null;"><b>{{commitctrl.frequency? commitctrl.frequencies[commitctrl.frequency-1]: ''}}</b></span>
          <span>for the next </span>
          <input name="duration" ng-class="{'input-error': commitctrl.duration && !commitctrl.isValidDuration(commitctrl.duration)}" class="text-uppercase text-center no-outline secondary-text" style="font-weight: bold; max-width: 8%" type="text" placeholder="5" ng-model="commitctrl.duration" maxlength="3" required>
          <span> weeks</span>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <br>
            <br>
            <div class="text-center" ng-show="commitctrl.activity && commitctrl.frequency && commitctrl.duration && commitctrl.isValidDuration(commitctrl.duration)">
              <button ng-disabled="!commitForm.$valid" type="submit" class="btn primary-button text-uppercase">commit</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
<br>