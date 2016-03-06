(function(addItemModule){
    'use strict';

    addItemModule.controller('addItemCtrl', ['$scope', 'ModalService', function($scope, ModalService){
        $scope.options = [
            'New',
            'Started',
            'Finished'
        ];
        $scope.owners = [
            'His',
            'Hers'
        ];

        $scope.close = function(result) {
            close(result, 500);
        };
    }]);
}(angular.module('AddItemModule')));