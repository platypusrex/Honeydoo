(function(authModule){
    'use strict';

    authModule.directive('authForm', function(){
        return {
            restrict: 'E',
            templateUrl: 'app/components/auth/auth.html',
            controller: 'authCtrl',
            transclude: true,
            scope: {
                submitAction: '&',
                error: '=',
                formTitle: '@'
            }
        }
    });
}(angular.module('AuthModule')));