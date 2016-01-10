(function(sidenavModule){
    'use strict';

    sidenavModule.factory('sidenavService', [
        'authService',
        'firebaseDataService',
        '$firebaseObject',
        function(authService, firebaseDataService, $firebaseObject){
        var getUserAuth = function(){
            return authService.firebaseAuthObject.$getAuth();
        };

        var getUserData = function(uid){
            var user = firebaseDataService.users.child(uid);
            return $firebaseObject(user);
        };

        return {
            getUserAuth: getUserAuth,
            getUserData: getUserData
        }
    }]);
}(angular.module('SidenavModule')));