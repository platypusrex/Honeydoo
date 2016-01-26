(function(connectModule){
    'use strict';

    connectModule.factory('connectService', ['firebaseDataService', '$firebaseArray', function(firebaseDataService, $firebaseArray){
        var getUsers = function(){
            var users = firebaseDataService.users;
            return $firebaseArray(users);
        };

        return {
            getUsers: getUsers
        }
    }]);
}(angular.module('ConnectModule')));