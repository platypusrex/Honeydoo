(function(honeyChatModule){
    'use strict';

    honeyChatModule.controller('honeyChatCtrl', [
        '$scope',
        'sidenavService',
        'honeyChatService',
        'firebaseDataService',
        'ModalService',
        'close',
        'growl',
        function($scope, sidenavService, honeyChatService, firebaseDataService, ModalService, close, growl){
            $scope.user = honeyChatService.getUserAuth();
            $scope.userData = null;
            $scope.honeyData = null;
            $scope.showModalBody = false;

            $scope.close = function(result) {
                close(result, 500);
            };

            var growlerError = function(err){
                growl.error('<i class="fa fa-times"></i><strong>Oh shizzle my nizzle ' + err, {ttl: 5000})
            };

            var updateChatCount = function(chatId){
                console.log('i got called');
                var chats = sidenavService.getChats(chatId);
                var ref = firebaseDataService.users.child($scope.user.uid);

                chats.$loaded(
                    function(data){
                        ref.update({
                            lastChatLength: data.length
                        });
                    },
                    function(error){
                        console.log(error);
                    }
                );
            };

            if($scope.user){
                var userData = sidenavService.getUserData($scope.user.uid);
                userData.$loaded(
                    function(data){
                        $scope.userData = data;
                        var honeyData = null;

                        if($scope.userData.chatId){
                            $scope.showModalBody = true;
                            honeyData = sidenavService.getUserData($scope.userData.honey.uid);

                            honeyData.$loaded(
                                function(data){
                                    var honeyData = data;
                                },
                                function(error){
                                    growlerError(error);
                                }
                            );

                            $scope.messages = honeyChatService.getMessages($scope.userData.chatId);

                            $scope.addMessage = function(message){
                                updateChatCount($scope.userData.chatId);

                                $scope.messages.$add({
                                    img: $scope.userData.image,
                                    user: $scope.userData.username,
                                    text: message,
                                    timestamp: Firebase.ServerValue.TIMESTAMP
                                });
                                $scope.message = '';
                            };
                        }
                    },
                    function(error){
                        growlerError(error);
                    }
                );
            }
    }]);
}(angular.module('HoneyChatModule')));