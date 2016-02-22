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
            $scope.messages = [
                'this is a message',
                'hey baby girl. Just reminding you to pick up dog food',
                'ok. I\'ll stop by the store on the way home'
            ];

            var growlerError = function(err){
                growl.warning('<i class="fa fa-times"></i><strong>Oh shizzle my nizzle ' + err, {ttl: 5000})
            };

            if($scope.user){
                var userData = sidenavService.getUserData($scope.user.uid);
                userData.$loaded(
                    function(data){
                        $scope.userData = data;

                        if($scope.userData.honey.uid !== 'none'){
                            $scope.showModalBody = true;
                            var honeyData = sidenavService.getUserData($scope.userData.honey.uid);

                            honeyData.$loaded(
                                function(data){
                                    $scope.honeyData = data;
                                },
                                function(error){
                                    growlerError(error);
                                }
                            )
                        }

                        if($scope.user.chatId){

                        }else {

                        }

                    },
                    function(error){
                        growlerError(error);
                    }
                );
            }

            $scope.close = function(result) {
                close(result, 500);
            };
    }]);
}(angular.module('HoneyChatModule')));