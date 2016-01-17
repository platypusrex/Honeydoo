(function(sidenavModule){
    'use strict';

    sidenavModule.controller('sidenavCtrl', ['$scope', 'sidenavService', function($scope, sidenavService){
        $scope.user = sidenavService.getUserAuth();
        $scope.iconActive1 = false;
        $scope.iconActive2 = false;
        $scope.icon1 = 1;
        $scope.icon2 = 2;

        $scope.iconToggle = function(val){
            if(val === 1){
                $scope.iconActive1 = !$scope.iconActive1;
            }
            if(val === 2){
                $scope.iconActive2 = !$scope.iconActive2;
            }
        };

        if($scope.user){
            var userData = sidenavService.getUserData($scope.user.uid);
            userData.$loaded(
                function(data){
                    $scope.username = data.username;
                    $scope.firstLastName = data.firstname + ' ' + data.lastname;
                    $scope.userIcon = (data.gender === 'his');
                },
                function(error){
                    console.log(error);
                }
            );
        }

    }]);
}(angular.module('SidenavModule')));