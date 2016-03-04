(function(addItemModule){
    'use strict';

    addItemModule.directive('yourList', function(){
        return {
            restrict: 'A',
            templateUrl: 'app/components/addItem/templates/yourList.html',
            controller: 'addItemCtrl'
        }
    });
}(angular.module('AddItemModule')));