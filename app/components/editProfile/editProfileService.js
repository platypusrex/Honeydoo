(function(editProfileModule){
    'use strict';

    editProfileModule.factory('editProfileService', [
        'authService',
        function(authService){
            var getUserAuth = function(){
                return authService.firebaseAuthObject.$getAuth();
            };

            return {
                getUserAuth: getUserAuth
            }
    }]);
}(angular.module('EditProfileModule')));