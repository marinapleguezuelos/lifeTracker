angular.module('goalService', [])
// each function returns a promise object
.factory('Goals', function($http) {
    return {
        get : function() {
            return $http.get('/goals');
        },
        create : function(goalData) {
            return $http.post('/goals', goalData);
        },
        delete : function(id) {
            return $http.delete('/goals/' + id);
        },
        addOk : function(id, date) {
            if (!date) date = new Date();
            var obj = {day: date};
            return $http.put('/goals/' + id + '/ok', obj);
        },
        addKo : function(id, date) {
            if (!date) date = new Date();
            var obj = {day: date};
            return $http.put('/goals/' + id + '/ko', obj);
        },
        getDay : function(date) {
          if (!date) date = new Date();
          var month = (date.getMonth()+1);
          if (month<10) {month="0" + month;}
          var day = date.getDate();
          if (day<10) {day="0" + day;}
          var dateParameter = "" + date.getFullYear() + month + day;
          return $http.get('/days/' + dateParameter);
        }
    }
});
