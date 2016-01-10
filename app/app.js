(function(){
    'use strict';

    angular.module('HoneydooApp', [
        'ngRoute',
        'firebase',
        'AuthModule',
        'NavModule',
        'CoreModule',
        'HomeModule',
        'SidenavModule',
        'ContentModule'])
        .config(['$routeProvider', function($routeProvider){
            $routeProvider
                .otherwise({
                    redirectTo: '/login'
                });
        }])
        .run(['$rootScope', '$location', function($rootScope, $location){
            $rootScope.$on('$routeChangeError', function(event, next, previous, error){
                if(error === 'AUTH_REQUIRED'){
                    $location.path('/login');
                }
            });
        }]);
}());