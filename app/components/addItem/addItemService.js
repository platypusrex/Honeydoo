(function(addItemModule){
    'use strict';

    addItemModule.factory('addItemService', [
        'firebaseDataService',
        'authService',
        '$firebaseArray',
        function(firebaseDataService, authService, $firebaseArray){
            var getUserAuth = function(){
                return authService.firebaseAuthObject.$getAuth();
            };

            var getYourList = function(userId){
                var ref = firebaseDataService.users.child(userId).child('yourlist');

                return $firebaseArray(ref);
            };

            var getHoneyList = function(userId){
                var ref = firebaseDataService.users.child(userId).child('honeyList');

                return $firebaseArray(ref);
            };

            return {
                getUserAuth: getUserAuth,
                getYourList: getYourList,
                getHoneyList: getHoneyList
            }
    }]);
}(angular.module('AddItemModule')));