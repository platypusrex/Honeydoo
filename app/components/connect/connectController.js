(function(connectModule){
    'use strict';

    connectModule.controller('connectCtrl', ['$scope', 'connectService', '$timeout', function($scope, connectService, $timeout){
        var usersData = connectService.getUsers();
        usersData.$loaded(
            function(data){
                var users = [];
                angular.forEach(data, function(val, i){
                    this.push({option: val.firstname + ' ' + val.lastname, value: i + 1});
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
        )
    }]);
}(angular.module('ConnectModule')));