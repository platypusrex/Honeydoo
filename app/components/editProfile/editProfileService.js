(function(editProfileModule){
    'use strict';

    editProfileModule.factory('editProfileService', [
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

            var changePassword = function(userObj){
                return authService.firebaseAuthObject.$changePassword(userObj);
            };

            return {
                getUserAuth: getUserAuth,
                getUserData: getUserData,
                changePassword: changePassword
            }
    }]);
}(angular.module('EditProfileModule')));