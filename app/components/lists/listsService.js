(function(listsModule){
    'use strict';

    listsModule.factory('listsService', ['firebaseDataService', function(){
        var getUserAuth = function(){
            return authService.firebaseAuthObject.$getAuth();
        };

        return {
            getUserAuth: getUserAuth
        }
    }]);
}(angular.module('ListsModule')));