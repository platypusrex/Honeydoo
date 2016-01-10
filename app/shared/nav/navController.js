(function(navModule){
    'use strict';

    navModule.controller('navCtrl', ['$scope', '$location', '$firebaseAuth', 'firebaseDataService', '$firebaseObject', 'authService', function($scope, $location, $firebaseAuth, firebaseDataService, $firebaseObject, authService){
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

        authService.firebaseAuthObject.$onAuth(function(auth){
            $scope.loggedIn = (auth) ? true : false;
            if(auth){
                $scope.user = auth;
            }
        });

        function logout(){
            authService.logout();
            $location.path('/login');
        }
    }]);
}(angular.module('NavModule')));