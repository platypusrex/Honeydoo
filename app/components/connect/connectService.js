(function(connectModule){
    'use strict';

    connectModule.factory('connectService', ['firebaseDataService', '$firebaseArray', 'authService', function(firebaseDataService, $firebaseArray, authService){
        var getUserAuth = function(){
            return authService.firebaseAuthObject.$getAuth();
        };

        var getUsers = function(){
            var users = firebaseDataService.users;
            return $firebaseArray(users);
        };

        return {
            getUserAuth: getUserAuth,
            getUsers: getUsers
        }
    }]);
}(angular.module('ConnectModule')));