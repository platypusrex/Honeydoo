(function(editProfileModule){
    'use strict';

    editProfileModule.controller('editProfileCtrl', [
        '$scope',
        'editProfileService',
        'firebaseDataService',
        'sidenavService',
        'growl',
        '$timeout',
        function($scope, editProfileService, firebaseDataService, sidenavService, growl, $timeout){
            var honeyUid = null;
            $scope.userObject = null;
            $scope.honeyObject = null;
            $scope.disable = true;
            $scope.user = editProfileService.getUserAuth();
            var inviteStatus = sidenavService.getInvitationStatus($scope.user.uid);
            var userData = editProfileService.getUserData($scope.user.uid);

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

                    //if(honeyUid){
                    //    var honeyData = editProfileService.getUserData(honeyUid);
                    //
                    //    honeyData.$loaded(
                    //        function(data){
                    //            $scope.honeyObject = data;
                    //
                    //        },
                    //        function(error){
                    //            console.log(error);
                    //            growlerError(error);
                    //        }
                    //    );
                    //
                    //    honeyData.$bindTo($scope, 'honeyObject').then(function(){
                    //        $scope.$watch('honeyObject', function(obj){
                    //            $scope.honeyObject = obj;
                    //        });
                    //    });
                    //}
                },
                function(error){
                    growlerError(error);
                }
            );

            inviteStatus.$bindTo($scope, 'status').then(function(){
                $scope.$watch('status.status', function(status){
                    if(status === 'connected'){
                        $scope.disable = false;
                    }
                    if(status === 'denied' || status === 'rejected' || status === 'sent' || status === 'received'){
                        $scope.disable = true;
                    }
                });
            });

            $timeout(function(){
                if(honeyUid){
                    var honeyData = editProfileService.getUserData(honeyUid);
                    honeyData.$bindTo($scope, 'honeyObject').then(function(){
                        $scope.$watch('honeyObject', function(obj){
                            $scope.honeyObject = obj;
                        });
                    });
                    console.log($scope.honeyObject);
                }
            }, 1000);

            var growlerSuccess = function(){
                growl.warning('<i class="fa fa-check"></i><strong>Alright!&nbsp;</strong>You\'re account changes have been saved successfully', {ttl: 5000});
            };

            var growlerError = function(err){
                growl.error('<strong>Oh shizzle, my nizzle!</strong>&nbsp;' + err, {ttl: 5000});
            };

            var saveUserData = function(userObj){
                var ref = firebaseDataService.users;

                ref.child(userObj.uuid).update({
                    firstname: (userObj.first) ? userObj.first : $scope.userObject.firstname,
                    lastname: (userObj.last) ? userObj.last : $scope.userObject.lastname,
                    username: (userObj.un) ? userObj.un : $scope.userObject.username,
                    gender: (userObj.gender) ? userObj.gender : $scope.userObject.gender
                }, growlerSuccess());

                if(userObj.huid){
                    ref.child(userObj.huid).update({
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
    }]);
}(angular.module('EditProfileModule')));