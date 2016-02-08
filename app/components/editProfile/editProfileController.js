(function(editProfileModule){
    'use strict';

    editProfileModule.controller('editProfileCtrl', [
        '$scope',
        'editProfileService',
        'firebaseDataService',
        'growl',
        function($scope, editProfileService, firebaseDataService, growl){
            var honeyUid = null;
            $scope.firstName = null;
            $scope.lastName = null;
            $scope.userName = null;
            $scope.gender = null;
            $scope.user = editProfileService.getUserAuth();
            console.log($scope.user);
            var growlerSuccess = function(){
                growl.warning('<i class="fa fa-check"></i><strong>Alright!&nbsp;</strong>You\'re account changes have been saved successfully', {ttl: 5000});
            };

            var growlerError = function(err){
                growl.error('<strong>Oh shizzle, my nizzle!</strong>&nbsp;' + err, {ttl: 5000});
            };

            var saveUserData = function(userObj){
                var ref = firebaseDataService.users;

                ref.child(userObj.uuid).update({
                    firstname: (userObj.first) ? userObj.first : $scope.firstName,
                    lastname: (userObj.last) ? userObj.last : $scope.lastName,
                    username: (userObj.un) ? userObj.un : $scope.userName,
                    gender: (userObj.gender) ? userObj.gender : $scope.gender
                }, growlerSuccess());

                ref.child(userObj.huid).update({
                    honey: {
                        firstname: (userObj.first) ? userObj.first : $scope.firstName,
                        lastname: (userObj.last) ? userObj.last : $scope.lastName,
                        uid: userObj.uuid,
                        username: (userObj.un) ? userObj.un : $scope.userName
                    }
                });
            };

            $scope.submitUpdate = function(u){
                var userObj = {
                    uuid: $scope.user.uid,
                    huid: honeyUid,
                    first: u.u.fname,
                    last: u.u.lname,
                    un: u.u.uname,
                    gender: u.u.gen
                };
                var userPasswordObj = {
                    email: $scope.user.password.email,
                    oldPassword: u.u.oldPassword,
                    newPassword: u.u.newPassword
                };
                console.log(userPasswordObj);

                if(u.u.newPassword){
                    editProfileService.changePassword(userPasswordObj)
                        .then(function(){
                            saveUserData(userObj);
                        })
                        .then(function(){
                            $scope.u = {};
                            $scope.updateForm.$setPristine();
                            $scope.updateForm.$setUntouched();
                        })
                        .catch(function(error){
                            growlerError(error);
                        });
                }else {
                    saveUserData(userObj);
                    $scope.u = {};
                    $scope.updateForm.$setPristine();
                    $scope.updateForm.$setUntouched();
                }
            };

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

    }]);
}(angular.module('EditProfileModule')));