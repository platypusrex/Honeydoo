(function(honeyChatModule){
    'use strict';

    honeyChatModule.factory('honeyChatService', ['firebaseDataService', 'authService', '$firebaseArray', function(firebaseDataService, authService, $firebaseArray){
        var getUserAuth = function(){
            return authService.firebaseAuthObject.$getAuth();
        };

        var getMessages = function(chatId){
            var ref = firebaseDataService.chats.child(chatId);

            return $firebaseArray(ref);
        };

        return {
            getUserAuth: getUserAuth,
            getMessages: getMessages
        }
    }]);
}(angular.module('HoneyChatModule')));