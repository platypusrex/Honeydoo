(function(connectModule){
    'use strict';

    connectModule.directive('selectpicker', ['$timeout', function($timeout){
        return {
            restrict: 'E',
            scope: {
                array: '=',
                model: '=',
                disable: '=',
                changeDisable: '&'
            },
            template: '<select class="selectpicker form-control show-tick" multiple title="Honey search" data-max-options="1" data-live-search="true" ng-disabled="disable" ng-options="o.option for o in array.availableUsers track by o.value"></select>',
            replace: true,
            link: function(scope, element, attrs){
                $(element).selectpicker();

                $timeout(function(){
                    scope.$apply(function(){
                        scope.disable = scope.changeDisable();
                    }, 2000);
                });

                scope.$watch('disable', function(changeValue){
                    console.log(changeValue + '\n' + 'change detected');
                });
            }
        }
    }]);
}(angular.module('ConnectModule')));