angular.module('goalController', [])
.controller('goalCtrl', function($scope, $http, Goals) {
  Goals.get().success(function(data) {
    for (var currentIndex=0; currentIndex<data.length; currentIndex=currentIndex+1) {
      var currentElement = data[currentIndex];
      currentElement.percentage = (currentElement.ok/(currentElement.ok+currentElement.ko))*100;
    }
    $scope.goals = data;
  });
  $scope.addGoal = function() {
    if(!$scope.goalName || $scope.goalName === '') { return; }
    var goalObject = {
      description: $scope.goalName,
      ok: 0,
      ko: 0
    };
    Goals.create(goalObject).success(function(data) {
      data.percentage = 0;
      $scope.goals.push(data);
      $scope.goalName = '';
    });
  };
  $scope.removeGoal = function(goal) {
    Goals.delete(goal._id).success(function(data) {
      var index = $scope.goals.indexOf(goal);
      $scope.goals.splice(index, 1);
    });
  };
  $scope.addOk = function(goal) {
    Goals.addOk(goal._id).success(function(data) {
    });
  };
  $scope.addKo = function(goal) {
    Goals.addKo(goal._id).success(function(data) {
    });
  };
});
