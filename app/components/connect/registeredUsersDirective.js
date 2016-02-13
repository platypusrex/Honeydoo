(function(connectModule){
    'use strict';

    connectModule.directive('registeredUsers', function(){
        return {
            restrict: 'A',
            templateUrl: 'app/components/connect/templates/registeredUsers.html',
            controller: 'connectCtrl'
        }
    });
}(angular.module('ConnectModule')));