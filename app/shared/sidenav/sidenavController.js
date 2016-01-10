(function(sidenavModule){
    'use strict';

    sidenavModule.controller('sidenavCtrl', ['$scope', 'sidenavService', function($scope, sidenavService){
        $scope.user = sidenavService.getUserAuth();

        if($scope.user){
            var userData = sidenavService.getUserData($scope.user.uid);
            userData.$loaded(
                function(data){
                    $scope.username = data.username;
                },
                function(error){
                    console.log(error);
                }
            );
        }

    }]);
}(angular.module('SidenavModule')));