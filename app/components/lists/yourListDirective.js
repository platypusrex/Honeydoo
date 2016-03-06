(function(listsModule){
    'use strict';

    listsModule.directive('yourList', function(){
        return {
            restrict: 'A',
            templateUrl: 'app/components/lists/templates/yourList.html',
            controller: 'listsCtrl'
        }
    });
}(angular.module('ListsModule')));