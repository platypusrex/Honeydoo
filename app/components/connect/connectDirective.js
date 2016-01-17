(function(connectModule){
    'use strict';

    connectModule.directive('connectDirective', function(){
        return {
            restrict: 'E',
            templateUrl: 'app/components/connect/connect.html',
            controller: 'connectCtrl'
        }
    });
}(angular.module('ConnectModule')));