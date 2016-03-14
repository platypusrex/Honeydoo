(function(listsModule){
    'use strict';

    listsModule.factory('listsService', ['firebaseDataService', '$firebaseArray', function(firebaseDataService, $firebaseArray){
        var getUserAuth = function(){
            return authService.firebaseAuthObject.$getAuth();
        };

        var getListItem = function(uid, list){
            var ref = firebaseDataService.users.child(uid).child(list);
            return $firebaseArray(ref);
        };

        return {
            getUserAuth: getUserAuth,
            getListItem: getListItem
        }
    }]);
}(angular.module('ListsModule')));