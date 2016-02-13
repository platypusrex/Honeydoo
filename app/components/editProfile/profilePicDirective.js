(function(editProfileModule){
    'use strict';

    editProfileModule.directive('profilePic', function(){
        return {
            restrict: 'A',
            templateUrl: 'app/components/editProfile/templates/profilePic.html',
            controller: 'editProfileCtrl'
        }
    });
}(angular.module('EditProfileModule')));