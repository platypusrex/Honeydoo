(function(addItemModule){
    'use strict';

    addItemModule.factory('addItemService', [
        'firebaseDataService',
        'authService',
        '$firebaseArray',
        '$firebaseObject',
        function(firebaseDataService, authService, $firebaseArray, $firebaseObject){
            var getUserAuth = function(){
                return authService.firebaseAuthObject.$getAuth();
            };

            var getYourList = function(userId){
                var ref = firebaseDataService.users.child(userId).child('yourList');

                return $firebaseArray(ref);
            };

            var getHoneyList = function(userId){
                var ref = firebaseDataService.users.child(userId).child('honeyList');

                return $firebaseArray(ref);
            };

            var getCategories = function(){
                var ref = firebaseDataService.categories;

                return $firebaseObject(ref);
            };

            return {
                getUserAuth: getUserAuth,
                getYourList: getYourList,
                getHoneyList: getHoneyList,
                getCategories: getCategories
            }
    }]);
}(angular.module('AddItemModule')));