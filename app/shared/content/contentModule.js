(function(){
    'use strict';

    angular.module('ContentModule', ['$stateProvider'])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                .state('content', {})
                .state('connect', {
                    parent: 'content',
                    url: '/connect',
                    templateUrl: 'app/components/connect/connect.html',
                    controller: 'connectCtrl'
                })
        }])
        ;
}());