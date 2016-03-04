(function(addItemModule){
    'use strict';

    addItemModule.directive('honeyList', function(){
        return {
            restrict: 'A',
            templateUrl: 'app/components/addItem/templates/honeyList.html',
            controller: 'addItemCtrl'
        }
    });
}(angular.module('AddItemModule')));