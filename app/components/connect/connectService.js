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

        var getNotifications = function(uid){
            var notifications = firebaseDataService.users.child(uid).child('notifications');
            return $firebaseArray(notifications);
        };

        return {
            getUserAuth: getUserAuth,
            getUsers: getUsers,
            getNotifications: getNotifications
        }
    }]);
}(angular.module('ConnectModule')));