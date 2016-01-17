(function(){
    'use strict';

    angular.module('HoneydooApp', [
        'ui.router',
        'firebase',
        'AuthModule',
        'NavModule',
        'CoreModule',
        'HomeModule',
        'SidenavModule',
        'ContentModule',
        'ConnectModule'
        ])
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
            $urlRouterProvider.otherwise('/login');
        }])
        .run(['$rootScope', '$state', function($rootScope, $state){
            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
                if(error === 'AUTH_REQUIRED'){
                    $state.go('/login');
                }
            });
        }]);
}());