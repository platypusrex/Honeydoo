(function(editProfileModule){
    'use strict';

    editProfileModule.controller('editProfileCtrl', [
        '$scope',
        'editProfileService',
        'firebaseDataService',
        function($scope, editProfileService, firebaseDataService){
            var honeyUid = null;
            $scope.firstName = null;
            $scope.lastName = null;
            $scope.userName = null;
            $scope.gender = null;
            $scope.user = editProfileService.getUserAuth();

            if($scope.user){
                var userData = editProfileService.getUserData($scope.user.uid);

                userData.$loaded(
                    function(data){
                        $scope.firstName = data.firstname;
                        $scope.lastName = data.lastname;
                        $scope.userName = data.username;
                        $scope.gender = data.gender;
                        honeyUid = data.honey.uid;

                        if(data.gender === 'his'){
                            $scope.his = true;
                        }
                        if(data.gender === 'hers'){
                            $scope.hers = true;
                        }
                    },
                    function(error){
                        console.log(error);
                    }
                );
            }

            $scope.submitUpdate = function(u){
                var ref = firebaseDataService.users;
                var userUid = $scope.user.uid;

                if(u.u.newEmail){
                    if(u.u.newEmail === u.u.confirmEmail){
                        ref.child(userUid).update({
                            firstname: (u.u.fname) ? u.u.fname : $scope.firstName,
                            lastname: (u.u.lname) ? u.u.lname : $scope.lname,
                            username: (u.u.uname) ? u.u.uname : $scope.userName,
                            gender: (u.u.gen) ? u.u.gen : $scope.gender
                        });

                        ref.child(honeyUid).update({
                            honey: {
                                firstname: (u.u.fname) ? u.u.fname : $scope.firstName,
                                lastname: (u.u.lname) ? u.u.lname : $scope.lastName,
                                username: (u.u.uname) ? u.u.uname : $scope.userName
                            }
                        });
                    }
                }

                //ref.child(userUid).$update({
                //    firstname: (user.fname) ? user.fname : $scope.firstName,
                //    lastname: (user.lname) ? user.lname : $scope.lname,
                //    username: (user.uname) ? user.uname : $scope.userName,
                //    gender: (user.gen) ? user.gen : $scope.gender
                //});
            };

    }]);
}(angular.module('EditProfileModule')));