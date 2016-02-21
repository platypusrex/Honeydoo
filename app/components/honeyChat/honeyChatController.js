(function(honeyChatModule){
    'use strict';

    honeyChatModule.controller('honeyChatCtrl', [
        '$scope',
        'honeyChatService',
        'ModalService',
        'close',
        function($scope, honeyChatService, ModalService, close){
            $scope.user = honeyChatService.getUserAuth();

            $scope.close = function(result) {
                close(result, 500);
            };
    }]);
}(angular.module('HoneyChatModule')));