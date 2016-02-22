(function(coreModule){
    coreModule.factory('firebaseDataService', ['FIREBASE_URL', function(FIREBASE_URL){
        var root = new Firebase(FIREBASE_URL);

        return {
            root: root,
            users: root.child('users'),
            chats: root.child('chats')
        };
    }]);
}(angular.module('CoreModule')));