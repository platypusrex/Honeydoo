(function(){
    'use strict';

    angular.module('HoneydooApp', [
        'ui.router',
        'ngAnimate',
        'ngSanitize',
        'angular-growl',
        'angucomplete-alt',
        'nya.bootstrap.select',
        'moment-picker',
        'angularUtils.directives.dirPagination',
        'chart.js',
        'ModalModule',
        'firebase',
        'LandingModule',
        'AuthModule',
        'NavModule',
        'CoreModule',
        'HomeModule',
        'SidenavModule',
        'ContentModule',
        'DashboardModule',
        'ListsModule',
        'EditProfileModule',
        'ConnectModule',
        'HoneyChatModule',
        'AddItemModule',
        'EditItemModule'
        ])
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'growlProvider', function($stateProvider, $urlRouterProvider, $locationProvider, growlProvider){
            growlProvider.globalEnableHtml(true);
            $urlRouterProvider.otherwise('/');
        }])
        .run(['$rootScope', '$state', '$log', function($rootScope, $state, $log){
            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
                if(error === 'AUTH_REQUIRED'){
                    $state.go('/login');
                }

                $log.error('An error occurred during state change: ', error);

                $log.debug('event: ', event);
                $log.debug('toState: ', toState);
                $log.debug('toParams: ', toParams);
                $log.debug('fromState: ', fromState);
                $log.debug('fromParams: ', fromParams);
                $log.debug('error: ', error);
            });

            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                $log.debug('State change successful');

                $log.debug('event: ', event);
                $log.debug('toState: ', toState);
                $log.debug('toParams: ', toParams);
                $log.debug('fromState: ', fromState);
                $log.debug('fromParams: ', fromParams);
            });

            $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
                $log.error('State not found: ', unfoundState);
            });
        }]);
}());