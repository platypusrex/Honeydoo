(function(navModule){
    'use strict';

    navModule.controller('navCtrl', ['$scope', '$location', '$firebaseAuth', 'firebaseDataService', '$firebaseObject', 'authService', function($scope, $location, $firebaseAuth, firebaseDataService, $firebaseObject, authService){
        $scope.logOut = logout;
        //getUsername().$bindTo($scope, 'username');
        var authData = authService.firebaseAuthObject.$getAuth();
        console.log(authData);

        function getUsername(){
            if(authData){
                var ref = firebaseDataService.users;
                var username = '';
                ref.on('value', function(users){
                    users.forEach(function(user){
                        if(user.child('email').val() === authData.password.email){
                            username = user.child('username').val();
                            return true;
                        }
                    });
                });
                return username;
            }
        }

        authService.firebaseAuthObject.$onAuth(function(auth){
            $scope.loggedIn = (auth) ? true : false;
            if(auth){
                $scope.user = auth.password.email;
            }
        });

        function logout(){
            authService.logout();
            $location.path('/login');
        }
    }]);
}(angular.module('NavModule')));