/**
 * Created by ved on 21/3/15.
 */
var app =angular.module('myApp', []);

    app.controller('MainCtrl', function($scope, $timeout,Weather) {
        // Build the date object
        $scope.date = {};

        $scope.weather = {};

        Weather.getWeatherForecast("Mumbai")
            .then(function(data) {
                $scope.weather.forecast = data;
                console.log('data',data);
                console.log('$scope.weather.forecast',$scope.weather.forecast);
            });

        // Update function
        var updateTime = function() {
            $scope.date.raw = new Date();
            $timeout(updateTime, 1000);
        };

        updateTime();
    });

app.provider('Weather', function() {
    var apiKey = "";

    this.apiKey = '82616ef795ceecc3';

    this.getUrl = function(type, ext) {
        return "http://api.wunderground.com/api/" +
            this.apiKey + "/" + type + "/q/" +
            ext + '.json';
    };

    this.$get = function($q, $http) {
        var self = this;
        console.log('get this', this);
        return {
            getWeatherForecast: function(city) {
                var d = $q.defer();
                $http({
                    method: 'GET',
                    url: self.getUrl("forecast", city),
                    cache: true
                }).success(function(data) {
                    d.resolve(data.forecast.simpleforecast);
                }).error(function(err) {
                    d.reject(err);
                });
                return d.promise;
            }
        }
    }

});
