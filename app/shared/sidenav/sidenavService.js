(function(sidenavModule){
    'use strict';

    sidenavModule.factory('sidenavService', [
        'authService',
        'firebaseDataService',
        '$firebaseObject',
        '$firebaseArray',
        function(authService, firebaseDataService, $firebaseObject, $firebaseArray){
            var getUserAuth = function(){
                return authService.firebaseAuthObject.$getAuth();
            };

            var getUserData = function(uid){
                var user = firebaseDataService.users.child(uid);
                return $firebaseObject(user);
            };

            var getInvitationStatus = function(uid){
                var invitation = firebaseDataService.users.child(uid).child('invitation');
                return $firebaseObject(invitation);
            };

            var getChats = function(chatId){
                var chats = firebaseDataService.chats.child(chatId);
                return $firebaseArray(chats);
            };

            var currentChatLength = function(uid){
                var chatLength = firebaseDataService.users.child(uid).child('lastChatLength');
                return $firebaseObject(chatLength);
            };

            var getChatLengthDif = function(uid){
                var chatdif = firebaseDataService.users.child(uid).child('unreadChats');
                return $firebaseObject(chatdif);
            };

            var getId = function(){
                var PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
                var lastPushTime = 0;
                var lastRandChars = [];

                function doIt() {
                    var now = new Date().getTime();
                    var duplicateTime = (now === lastPushTime);
                    lastPushTime = now;

                    var timeStampChars = new Array(8);
                    for (var i = 7; i >= 0; i--) {
                        timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
                        now = Math.floor(now / 64);
                    }
                    if (now !== 0) throw new Error('We should have converted the entire timestamp.');

                    var id = timeStampChars.join('');

                    if (!duplicateTime) {
                        for (i = 0; i < 12; i++) {
                            lastRandChars[i] = Math.floor(Math.random() * 64);
                        }
                    } else {
                        for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
                            lastRandChars[i] = 0;
                        }
                        lastRandChars[i]++;
                    }
                    for (i = 0; i < 12; i++) {
                        id += PUSH_CHARS.charAt(lastRandChars[i]);
                    }
                    if(id.length != 20) throw new Error('Length should be 20.');

                    return id;
                }
                return doIt();
            };

            return {
                getUserAuth: getUserAuth,
                getUserData: getUserData,
                getInvitationStatus: getInvitationStatus,
                getChats: getChats,
                currentChatLength: currentChatLength,
                getChatLengthDif: getChatLengthDif,
                getId: getId
            }
    }]);
}(angular.module('SidenavModule')));