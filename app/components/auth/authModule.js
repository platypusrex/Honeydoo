(function(){
    'use strict';

    angular.module('AuthModule', ['firebase'])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'app/components/auth/login.html',
                    controller: 'authCtrl'
                })
                .state('register', {
                    url: '/register',
                    templateUrl: 'app/components/auth/register.html',
                    controller: 'authCtrl'
                });
        }]);
}());