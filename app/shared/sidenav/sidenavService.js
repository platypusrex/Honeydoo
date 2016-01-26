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

        var getInvitationStatus = function(uid){
            var invitation = firebaseDataService.users.child(uid).child('invitation');
            return $firebaseObject(invitation);
        };

        return {
            getUserAuth: getUserAuth,
            getUserData: getUserData,
            getInvitationStatus: getInvitationStatus
        }
    }]);
}(angular.module('SidenavModule')));