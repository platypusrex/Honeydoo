(function(){
    'use strict';

    angular.module('HoneydooApp', [
        'ui.router',
        'ngAnimate',
        'ngSanitize',
        'angular-growl',
        'angucomplete-alt',
        'ModalModule',
        'firebase',
        'AuthModule',
        'NavModule',
        'CoreModule',
        'HomeModule',
        'SidenavModule',
        'ContentModule',
        'ListsModule',
        'EditProfileModule',
        'ConnectModule',
        'HoneyChatModule',
        'AddItemModule'
        ])
        .config(['$stateProvider', '$urlRouterProvider', 'growlProvider', function($stateProvider, $urlRouterProvider, growlProvider){
            growlProvider.globalEnableHtml(true);
            $urlRouterProvider.otherwise('/login');
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