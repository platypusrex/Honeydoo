(function(editProfileModule){
    'use strict';

    editProfileModule.directive('disconnect', function(){
        return {
            restrict: 'A',
            templateUrl: 'app/components/editProfile/templates/disconnect.html',
            controller: 'editProfileCtrl'
        }
    });
}(angular.module('EditProfileModule')));