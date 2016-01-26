(function(connectModule){
    'use strict';

    connectModule.controller('connectCtrl', ['$scope', 'connectService', '$timeout', function($scope, connectService, $timeout){
        $scope.user = connectService.getUserAuth();
        var usersData = connectService.getUsers();

        usersData.$loaded(
            function(data){
                var users = [];
                angular.forEach(data, function(val, i){
                    if(val.$id !== $scope.user.uid){
                        this.push({option: val.firstname + ' ' + val.lastname, value: i + 1, email: val.email});
                    }
                }, users);

                $timeout(function(){
                    $scope.selectData = {
                        availableUsers: users
                    };
                    $timeout(function(){
                        $('select').selectpicker('refresh');
                    });
                });
            },
            function(error){
                console.log(error);
            }
        );

        $scope.$watch('myModel', function(val){
            console.log(val);
        });
    }]);
}(angular.module('ConnectModule')));