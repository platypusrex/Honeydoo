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
                .state('home.add', {
                    url: '/add',
                    views: {
                        'add-item': {
                            templateUrl: 'app/components/addItem/addItem.html',
                            controller: 'addItemCtrl'
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
                            templateUrl: 'app/components/connect/connect.html',
                            controller: 'connectCtrl'
                        }
                    }
                })
                .state('home.add_pic', {
                    url: '/add_pic',
                    views: {
                        'add-pic': {
                            templateUrl: 'app/components/addPic/addPic.html',
                            controller: 'addPicCtrl'
                        }
                    }
                })
                .state('home.edit_profile', {
                    url: '/edit_profile',
                    views: {
                        'edit-profile': {
                            templateUrl: 'app/components/editProfile/editProfile.html',
                            controller: 'editProfileCtrl'
                        }
                    }
                });
        }]);
}());