(function(navModule){
    'use strict';

    navModule.controller('navCtrl', [
        '$scope',
        '$state',
        '$firebaseAuth',
        'firebaseDataService',
        '$firebaseObject',
        'authService',
        '$rootScope',
        function($scope, $state, $firebaseAuth, firebaseDataService, $firebaseObject, authService, $rootScope){
            $rootScope.showSidenav = false;
            $scope.logOut = logout;
            var authData = authService.firebaseAuthObject.$getAuth();

            if(authData){
                var user = firebaseDataService.users.child(authData.uid);
                var userObj = $firebaseObject(user);
                userObj.$loaded(
                    function(data){
                        $scope.username = data.username;
                    },
                    function(error){
                        console.log(error);
                    }
                );
            }

            $scope.changeSidenavState = function(){
                $rootScope.showSidenav = !$rootScope.showSidenav;
            };

            authService.firebaseAuthObject.$onAuth(function(auth){
                $scope.loggedIn = (auth) ? true : false;
                if(auth){
                    $scope.user = auth;
                }
            });

            function logout(){
                authService.logout();
                $state.go('login');
            }
    }]);
}(angular.module('NavModule')));