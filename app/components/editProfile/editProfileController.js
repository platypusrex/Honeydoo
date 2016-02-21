(function(editProfileModule){
    'use strict';

    editProfileModule.controller('editProfileCtrl', [
        '$scope',
        'editProfileService',
        'firebaseDataService',
        'sidenavService',
        'growl',
        '$timeout',
        '$state',
        function($scope, editProfileService, firebaseDataService, sidenavService, growl, $timeout, $state){
            $scope.userObject = null;
            $scope.disable = true;
            $scope.user = editProfileService.getUserAuth();
            $scope.deleteUser = false;
            var honeyUid = null;
            var inviteStatus = sidenavService.getInvitationStatus($scope.user.uid);
            var userData = editProfileService.getUserData($scope.user.uid);
            var basicRef = firebaseDataService.users;

            userData.$loaded(
                function(data){
                    $scope.userObject = data;
                    honeyUid = (data.honey.uid !== 'none') ? data.honey.uid : null;

                    if(data.gender === 'his'){
                        $scope.his = true;
                    }
                    if(data.gender === 'hers'){
                        $scope.hers = true;
                    }

                    inviteStatus.$bindTo($scope, 'status').then(function(){
                        $scope.$watch('status.status', function(status){
                            $scope.honeyStatus = status;
                            if(status === 'connected'){
                                $scope.disable = false;
                            }
                            if(status === 'denied' || status === 'rejected' || status === 'sent' || status === 'received'){
                                $scope.disable = true;
                            }
                        });

                        $scope.$watch('status.userId', function(userId){
                            var honeyData = sidenavService.getUserData(userId);

                            if(!honeyUid){
                                honeyUid = userId;
                            }

                            honeyData.$loaded(
                                function (data) {
                                    $scope.honeyUsername = data.username;
                                    $scope.honeyName = data.firstname + ' ' + data.lastname;
                                    $scope.honeyImg = data.image;
                                    $scope.honeyGender = data.gender;
                                    $scope.honeyStatus = data.invitation.status;
                                },
                                function (error) {
                                    growlerError(error);
                                }
                            );

                        });
                    });
                },
                function(error){
                    growlerError(error);
                }
            );

            var growlerSuccess = function(){
                growl.warning('<i class="fa fa-check"></i><strong>Alright!&nbsp;</strong>You\'re account changes have been saved successfully', {ttl: 5000});
            };

            var growlerError = function(err){
                growl.error('<strong>Oh shizzle, my nizzle!</strong>&nbsp;' + err, {ttl: 5000});
            };

            var saveUserData = function(userObj){
                basicRef.child(userObj.uuid).update({
                    firstname: (userObj.first) ? userObj.first : $scope.userObject.firstname,
                    lastname: (userObj.last) ? userObj.last : $scope.userObject.lastname,
                    username: (userObj.un) ? userObj.un : $scope.userObject.username,
                    gender: (userObj.gender) ? userObj.gender : $scope.userObject.gender
                }, growlerSuccess());

                if(userObj.huid){
                    basicRef.child(userObj.huid).update({
                        honey: {
                            firstname: (userObj.first) ? userObj.first : $scope.userObject.firstname,
                            lastname: (userObj.last) ? userObj.last : $scope.userObject.lastname,
                            uid: userObj.uuid,
                            username: (userObj.un) ? userObj.un : $scope.userObject.username
                        }
                    });
                }
            };

            $scope.submitUpdate = function(u){
                var newUserObj = {
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

                if(u.u.newPassword){
                    editProfileService.changePassword(userPasswordObj)
                        .then(function(){
                            saveUserData(newUserObj);
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
                    saveUserData(newUserObj);
                    $scope.u = {};
                    $scope.updateForm.$setPristine();
                    $scope.updateForm.$setUntouched();
                }
            };

            $scope.initDelete = function(){
                $scope.deleteUser = true;
            };

            $scope.cancelDelete = function(){
                $scope.deleteUser = false;
            };

            $scope.deleteAcct = function(password){
                var userUid = $scope.user.uid;
                var userObj = {
                    email: $scope.user.password.email,
                    password: password
                };

                //if(honeyUid){
                basicRef.child(honeyUid).update({
                    honey: {
                        firstname: 'none',
                        lastname: 'none',
                        uid: 'none',
                        username: 'none'
                    },
                    invitation: {
                        notification: 'none',
                        status: 'none',
                        userId: 'none'
                    }
                });
                //}

                var onComplete = function(error) {
                    if (error) {
                        console.log('Synchronization failed');
                    } else {
                        console.log('Synchronization succeeded');
                    }
                };

                editProfileService.deleteAccount(userObj)
                    .then(function(){
                        basicRef.child(userUid).remove(onComplete);
                        $state.go('login');
                    })
                    .catch(function(err){
                        growlerError(err);
                    });
            };

            $scope.disconnectHoney = function(){
                $scope.disable = true;

                basicRef.child($scope.user.uid).update({
                    honey: {
                        firstname: 'none',
                        lastname: 'none',
                        uid: 'none',
                        username: 'none'
                    },
                    invitation: {
                        notification: 'none',
                        status: 'none',
                        userId: 'none'
                    }
                });

                basicRef.child(honeyUid).update({
                    honey: {
                        firstname: 'none',
                        lastname: 'none',
                        uid: 'none',
                        username: 'none'
                    },
                    invitation: {
                        notification: 'none',
                        status: 'none',
                        userId: 'none'
                    }
                });
            };
    }]);
}(angular.module('EditProfileModule')));