(function(editProfileModule){
    'use strict';

    editProfileModule.directive('generalSettings', function(){
        return {
            restrict: 'A',
            templateUrl: 'app/components/editProfile/templates/generalSettings.html',
            controller: 'editProfileCtrl'
        }
    });
}(angular.module('EditProfileModule')));