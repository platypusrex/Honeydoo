(function(navModule){
    'use strict';

    navModule.controller('navCtrl', [
        '$scope',
        '$state',
        '$firebaseAuth',
        'firebaseDataService',
        '$firebaseObject',
        'authService',
        'ModalService',
        '$rootScope',
        function($scope, $state, $firebaseAuth, firebaseDataService, $firebaseObject, authService, ModalService, $rootScope){
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

            $scope.showLogin = function(){
                ModalService.showModal({
                    templateUrl: "app/components/auth/login.html",
                    controller: "authCtrl"
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        console.log('hey dude')
                    });
                });
            };

            $scope.showRegister = function(){
                ModalService.showModal({
                    templateUrl: "app/components/auth/register.html",
                    controller: "authCtrl"
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        console.log('hey dude')
                    });
                });
            };

            $scope.changeSidenavState = function(){
                if($scope.user) {
                    $rootScope.showSidenav = !$rootScope.showSidenav;
                }
            };

            authService.firebaseAuthObject.$onAuth(function(auth){
                $scope.loggedIn = (auth) ? true : false;
                if(auth){
                    $scope.user = auth;
                }
            });

            function logout(){
                authService.logout();
                $state.go('/');
            }
    }]);
}(angular.module('NavModule')));