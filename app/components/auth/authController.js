(function(authModule){
    'use strict';

    authModule.controller('authCtrl', [
        '$scope',
        '$state',
        'ModalService',
        'authService',
        'firebaseDataService',
        '$element',
        'growl',
        '$timeout',
        function($scope, $state, ModalService, authService, firebaseDataService, $element, growl, $timeout){
            var ref = firebaseDataService.users;

            var growlerSuccess = function(){
                growl.warning('<i class="fa fa-check"></i><strong>Congrats!&nbsp;</strong>Now click the Sign In button and get going!', {ttl: 5000})
            };

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
                        $element.modal('hide');
                        $timeout(function(){
                            growlerSuccess();
                        }, 200);
                    })
                    .then(function(){
                        $state.go('/');
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
                         $element.modal('hide');
                         $state.go('home.dashboard');
                     })
                    .catch(function(error){
                         $scope.error = error;
                    });
             };
        }
    ]);
}(angular.module('AuthModule')));