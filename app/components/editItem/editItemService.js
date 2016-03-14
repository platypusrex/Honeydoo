(function(editItemModule){
    'use strict';

    editItemModule.factory('editItemService', ['firebaseDataService', '$firebaseArray', function(firebaseDataService, $firebaseArray){
        var getHoneydoo = function(uid, list){
            var ref = firebaseDataService.users.child(uid).child(list);
            return $firebaseArray(ref);
        };

        return {
            getHoneydoo: getHoneydoo
        }
    }]);
}(angular.module('EditItemModule')));