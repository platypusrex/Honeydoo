(function(listsModule){
    'use strict';

    listsModule.directive('completed', function(){
        return {
            restrict: 'A',
            templateUrl: 'app/components/lists/templates/completed.html',
            controller: 'listsCtrl'
        }
    });
}(angular.module('ListsModule')));