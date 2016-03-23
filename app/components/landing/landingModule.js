(function(){
    'use strict';

    angular.module('LandingModule', [])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                .state('/', {
                    url: '/',
                    templateUrl: 'app/components/landing/landing.html',
                    controller: 'landingCtrl'
                })
        }]);
}());