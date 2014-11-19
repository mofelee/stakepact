(function() {
  'use strict';

  angular.module('app').controller('CommitCtrl', CommitCtrl);

  CommitCtrl.$inject = ['$log', '$scope', '$timeout', '$state', 'commitService'];

  function CommitCtrl($log, $scope, $timeout, $state, commitService){
    var vm = this;
    vm.activate = activate;
    vm.activity = null;
    vm.duration = null;
    vm.frequencies = ['1x weekly', '2x weekly', '3x weekly', '4x weekly', '5x weekly', '6x weekly', 'daily'];
    vm.frequency = null;
    vm.isValidDuration = isValidDuration;
    vm.loadCommitment = loadCommitment;
    vm.submit = submit;
    vm.setFrequency = setFrequency;
    vm.updateActivity = updateActivity;

    vm.activate();

    var delay = 1000;
    var timer = false;

    function activate(){
      loadCommitment();
    }
    
    function loadCommitment(){
      var commitment = commitService.getCommitment();
      if(commitment) {
        $scope.tempActivity = commitment.activity;
        vm.activity = commitment.activity;
        vm.frequency = commitment.frequency;
        vm.duration = commitment.duration;
      }
      return commitment;
    }

    function setFrequency(f){
      vm.frequency = f;
    }

    // simple submit function
    function submit() {
      if($scope.commitForm.$valid && vm.frequency) {
        // save the data to the collection with an anonymous user status ~> convert to real user and tag on data
        commitService.setCommitment(vm.activity, vm.frequency, vm.duration);
        $state.go('create.signup');
      }
    }

    // if no activity, delay until user stops entering activity, then submit change
    // if activity exists and is being updated, update immediately
    function updateActivity(){
      if(timer){
        $timeout.cancel(timer);
      }

      if(!$scope.activity) {
        timer = $timeout(function(){
            /* run code*/
            vm.activity = $scope.tempActivity;
        }, delay);
      } else {
        vm.activity = $scope.tempActivity;
      }
    }

    function isValidDuration(val) {
      console.log(val);
      return isNumber(val) && parseInt(val) > 0 && parseInt(val) < 53;
    }

    function isNumber(n){
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
  }
})();