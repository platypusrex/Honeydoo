(function(connectModule){
    'use strict';

    connectModule.factory('connectService', [
        'firebaseDataService',
        '$firebaseArray',
        'authService',
        'sidenavService',
        function(firebaseDataService, $firebaseArray, authService, sidenavService){
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

            var addNotification = function(uid, message, honeyUid){
                var notifications = getNotifications(uid);
                var honeyData = sidenavService.getUserData(honeyUid);

                honeyData.$loaded(
                    function(data){
                        var name = data.firstname + ' ' + data.lastname;

                        notifications.$add({
                            message: message + name
                        });
                    }
                );
            };

            return {
                getUserAuth: getUserAuth,
                getUsers: getUsers,
                getNotifications: getNotifications,
                addNotification: addNotification
            }
        }]);
}(angular.module('ConnectModule')));