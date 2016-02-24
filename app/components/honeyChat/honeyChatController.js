(function(honeyChatModule){
    'use strict';

    honeyChatModule.controller('honeyChatCtrl', [
        '$scope',
        'sidenavService',
        'honeyChatService',
        'ModalService',
        'close',
        'growl',
        function($scope, sidenavService, honeyChatService, ModalService, close, growl){
            $scope.user = honeyChatService.getUserAuth();
            $scope.userData = null;
            $scope.honeyData = null;
            $scope.showModalBody = false;

            $scope.close = function(result) {
                close(result, 500);
            };

            var growlerError = function(err){
                growl.warning('<i class="fa fa-times"></i><strong>Oh shizzle my nizzle ' + err, {ttl: 5000})
            };

            if($scope.user){
                var userData = sidenavService.getUserData($scope.user.uid);
                userData.$loaded(
                    function(data){
                        $scope.userData = data;

                        if($scope.userData.chatId){
                            $scope.showModalBody = true;
                            var honeyData = sidenavService.getUserData($scope.userData.honey.uid);

                            honeyData.$loaded(
                                function(data){
                                    $scope.honeyData = data;
                                },
                                function(error){
                                    growlerError(error);
                                }
                            );

                            $scope.messages = honeyChatService.getMessages($scope.userData.chatId);

                            //if($scope.messages.length === 0){
                            //    $scope.showChatGreeting = true;
                            //}

                            $scope.addMessage = function(message) {
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