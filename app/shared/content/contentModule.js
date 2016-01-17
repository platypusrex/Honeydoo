(function(){
    'use strict';

    angular.module('ContentModule', [])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                .state('content', {
                    abstract: true,
                    url: '/content'
                })
                .state('content.connect', {
                    url: '/connect',
                    templateUrl: 'app/components/connect/connect.html'
                })
        }]);
}());