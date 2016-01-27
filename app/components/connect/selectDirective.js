(function(connectModule){
    'use strict';

    connectModule.directive('selectpicker', function(){
        return {
            restrict: 'E',
            scope: {
                array: '=',
                model: '='
            },
            template: '<select class="selectpicker form-control show-tick" multiple title="Honey search" data-max-options="1" data-live-search="true" data-style="btn-primary" ng-options="o.option for o in array.availableUsers track by o.value"></select>',
            replace: true,
            link: function(scope, element, attrs){
                $(element).selectpicker();
            }
        }
    });
}(angular.module('ConnectModule')));