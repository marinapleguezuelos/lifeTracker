angular.module('goalController', [])
.controller('goalCtrl', function($scope, $http, Goals) {
  Goals.get().success(function(data) {
  for (var i=0; i<data.length;i++){
      data[i].ok=i;
      data[i].ko=1;
      data[i].percentage= (data[i].ok/(data[i].ko+data[i].ko))*100
    }
    $scope.goals = data;
  });
  $scope.addGoal = function() {
    if(!$scope.goalName || $scope.goalName === '') { return; }
    var goalObject = {
      description: $scope.goalName,
    };
    Goals.create(goalObject).success(function(data) {
      goalObject._id=data._id;
      goalObject.percentage=11;
      $scope.goals.push(goalObject);
      $scope.goalName = '';
    });
  };
  $scope.removeGoal = function(goal) {
    Goals.delete(goal._id).success(function(data) {
      var index = $scope.goals.indexOf(goal);
      $scope.goals.splice(index, 1);
    });
  };
});
