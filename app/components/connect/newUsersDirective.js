(function(connectModule){
    'use strict';

    connectModule.directive('newUsers', function(){
        return {
            restrict: 'A',
            templateUrl: 'app/components/connect/templates/newUsers.html',
            controller: 'connectCtrl'
        }
    });
}(angular.module('ConnectModule')));