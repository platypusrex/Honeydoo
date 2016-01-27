(function(sidenavModule){
    'use strict';

    sidenavModule.controller('sidenavCtrl', ['$scope', 'sidenavService', '$state', function($scope, sidenavService, $state){
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

        $scope.changeContent = function(val){
            console.log(val);
            if(val === 1){
                $state.go('connect');
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

            var inviteStatus = sidenavService.getInvitationStatus($scope.user.uid);
            inviteStatus.$bindTo($scope, 'status').then(function(){
                $scope.value = $scope.status.status;

                var honeyData = sidenavService.getUserData($scope.status.userId);
                honeyData.$loaded(
                    function(data){
                        $scope.honeyName = data.firstname + ' ' + data.lastname;
                    },
                    function(error){
                        console.log(error);
                    }
                );
            });
        }

    }]);
}(angular.module('SidenavModule')));