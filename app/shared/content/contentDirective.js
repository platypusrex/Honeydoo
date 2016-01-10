(function(contentModule){
    'use strict';

    contentModule.directive('contentDirective', function(){
        return {
            restrict: 'E',
            templateUrl: 'app/shared/content/content.html'
        }
    })
}(angular.module('ContentModule')));