(function(authModule){
    'use strict';

    authModule.controller('authCtrl', ['$scope', '$location', 'authService', 'firebaseDataService', function($scope, $location, authService, firebaseDataService){
        $scope.register = function(user){
            authService.register(user)
                .then(function(userData){
                    $location.path('/form');
                    var ref = firebaseDataService.users;
                    var uid = userData.uid;

                    ref.child(uid).set({
                        email: user.email,
                        username: user.username,
                        gender: user.gender
                    });

                    return $scope.user;
                })
                .then(function(){
                    $location.path('/login');
                })
                .catch(function(error){
                    $scope.error = error;
                });
        };

         $scope.login = function(user){
             return authService.login(user)
                .then(function(res){
                    $location.path('/home');
                    return res;
                })
                .catch(function(error){
                    $scope.error = error;
                });
         };
    }]);
}(angular.module('AuthModule')));