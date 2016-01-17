(function(){
    'use strict';

    angular.module('HomeModule', ['AuthModule'])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: 'app/components/home/home.html',
                    controller: 'homeCtrl'
                });
        }])
        ;
}());