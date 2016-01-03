(function(){
    'use strict';

    angular.module('AuthModule', ['firebase'])
        .config(['$routeProvider', function($routeProvider){
            $routeProvider
                .when('/login', {
                    templateUrl: 'app/components/auth/login.html',
                    controller: 'authCtrl'
                })
                .when('/register', {
                    templateUrl: 'app/components/auth/register.html',
                    controller: 'authCtrl'
                });
        }]);
}());