(function(editProfileModule){
    'use strict';

    editProfileModule.controller('editProfileCtrl', [
        '$scope',
        'editProfileService',
        function($scope, editProfileService){
            $scope.user = editProfileService.getUserAuth();

    }]);
}(angular.module('EditProfileModule')));