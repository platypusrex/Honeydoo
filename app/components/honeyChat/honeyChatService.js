(function(honeyChatModule){
    'use strict';

    honeyChatModule.factory('honeyChatService', ['firebaseDataService', 'authService', function(firebaseDataService, authService){
        var getUserAuth = function(){
            return authService.firebaseAuthObject.$getAuth();
        };

        return {
            getUserAuth: getUserAuth
        }
    }]);
}(angular.module('HoneyChatModule')));