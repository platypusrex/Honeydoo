(function(authModule){
    'use strict';

    authModule.controller('authCtrl', [
        '$scope',
        '$state',
        'authService',
        'firebaseDataService',
        function($scope, $state, authService, firebaseDataService){
            var ref = firebaseDataService.users;

            $scope.register = function(user){
                authService.register(user)
                    .then(function(userData){
                        var uid = userData.uid;

                        ref.child(uid).set({
                            email: user.email,
                            username: user.username,
                            gender: user.gender,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            invitation: {
                                status: 'none',
                                userId: 'none',
                                notification: 'You have no new notifications...'
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
                    .then(function(authData){
                         var uid = authData.uid;

                         ref.child(uid).update({
                             image: authData.password.profileImageURL
                         });

                         return authData;
                    })
                    .then(function(){
                         $state.go('home.connect');
                     })
                    .catch(function(error){
                         $scope.error = error;
                    });
             };
        }
    ]);
}(angular.module('AuthModule')));