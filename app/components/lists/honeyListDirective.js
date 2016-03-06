(function(listsModule){
    'use strict';

    listsModule.directive('honeyList', function(){
        return {
            restrict: 'A',
            templateUrl: 'app/components/lists/templates/honeyList.html',
            controller: 'listsCtrl'
        }
    });
}(angular.module('ListsModule')));