(function(){
    'use strict';

    angular.module('HomeModule', ['AuthModule'])
        .config(['$routeProvider', function($routeProvider){
            $routeProvider
                .when('/home', {
                    templateUrl: 'app/components/home/home.html',
                    controller: 'homeCtrl'
                });
        }]);
}());