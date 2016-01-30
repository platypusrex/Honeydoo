(function(authModule){
    'use strict';

    authModule.controller('authCtrl', [
        '$scope',
        '$state',
        'authService',
        'firebaseDataService',
        function($scope, $state, authService, firebaseDataService){
        $scope.register = function(user){
            authService.register(user)
                .then(function(userData){
                    var ref = firebaseDataService.users;
                    var uid = userData.uid;

                    ref.child(uid).set({
                        email: user.email,
                        username: user.username,
                        gender: user.gender,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        invitation: {
                            status: 'none',
                            userId: 'none'
                        },
                        honey: {
                            uid: 'none',
                            firstname: 'none',
                            lastname: 'none',
                            username: 'none'
                        }
                    });

                    return $scope.user;
                })
                .then(function(){
                    $state.go('login');
                })
                .catch(function(error){
                    $scope.error = error;
                });
        };

         $scope.login = function(user){
             return authService.login(user)
                .then(function(res){
                    $state.go('home');
                    return res;
                })
                .catch(function(error){
                    $scope.error = error;
                });
         };
    }]);
}(angular.module('AuthModule')));