(function(){
    'use strict';

    angular.module('HomeModule', [])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                .state('home', {
                    url: '/home',
                    views: {
                        '': {
                            templateUrl: 'app/components/home/home.html'
                        },
                        'sidenav@home': {
                            templateUrl: 'app/shared/sidenav/sidenav.html',
                            controller: 'sidenavCtrl'
                        },
                        'content@home': {
                            templateUrl: 'app/shared/content/content.html'
                        }
                    }
                })
                .state('home.dashboard', {
                    url: '/dashboard',
                    views: {
                        'dashboard': {
                            templateUrl: 'app/components/dashboard/dashboard.html',
                            controller: 'dashboardCtrl'
                        }
                    }
                })
                .state('home.add', {
                    url: '/add',
                    views: {
                        'add-item': {
                            templateUrl: 'app/components/lists/templates/lists.html',
                            controller: 'listsCtrl'
                        }
                    }
                })
                .state('home.your_list', {
                    url: '/your_list',
                    views: {
                        'your-list': {
                            templateUrl: 'app/components/yourList/yourList.html',
                            controller: 'yourListCtrl'
                        }
                    }
                })
                .state('home.partner_list', {
                    url: '/partner_list',
                    views: {
                        'partner-list': {
                            templateUrl: 'app/components/partnerList/partnerList.html',
                            controller: 'partnerListCtrl'
                        }
                    }
                })
                .state('home.connect', {
                    url: '/connect',
                    views: {
                        'connect': {
                            templateUrl: 'app/components/connect/templates/connect.html',
                            controller: 'connectCtrl'
                        }
                    }
                })
                .state('home.edit_profile', {
                    url: '/edit_profile',
                    views: {
                        'edit-profile': {
                            templateUrl: 'app/components/editProfile/templates/editProfile.html',
                            controller: 'editProfileCtrl'
                        }
                    }
                });
        }]);
}());