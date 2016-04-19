(function(connectModule){
    'use strict';

    connectModule.controller('connectCtrl', [
        '$scope',
        'connectService',
        '$timeout',
        'sidenavService',
        'firebaseDataService',
        'growl',
        function($scope, connectService, $timeout, sidenavService, firebaseDataService, growl){
            $scope.user = connectService.getUserAuth();
            $scope.honey = null;
            $scope.honeyUid = null;
            $scope.disable = false;
            $scope.users = null;
            var placeholder = 'http://www.disruptorbeam.com/assets/uploaded/news-thumbnails/Spock_final_thumb.png';
            var userData = sidenavService.getUserData($scope.user.uid);
            var usersData = connectService.getUsers();
            var inviteStatus = sidenavService.getInvitationStatus($scope.user.uid);

            usersData.$loaded(
                function(data){
                    $scope.users = [];
                    angular.forEach(data, function(val, i){
                        if(val.$id !== $scope.user.uid && val.invitation.status !== 'connected' && val.invitation.status !== 'sent' && val.invitation.status !== 'received'){
                            this.push({firstname: val.firstname, lastname: val.lastname, value: val.$id, un: val.username, img: (val.image) ? val.image : placeholder});
                        }
                    }, $scope.users);

                    $scope.honeySearch = function(str){
                        var matches = [];
                        $scope.users.forEach(function(user){
                            var fullname = user.firstname + ' ' + user.lastname;
                            if ((user.firstname.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                                (user.lastname.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                                (fullname.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0))
                            {
                                matches.push(user);
                            }
                        });
                        return matches;
                    };

                    //$timeout(function(){
                    //    $scope.selectData = {
                    //        availableUsers: users
                    //    };
                    //    $timeout(function(){
                    //        $('select').selectpicker('refresh');
                    //    });
                    //});
                },
                function(error){
                    console.log(error);
                }
            );

            userData.$loaded(
                function(data){
                    var userObj = data;

                    $scope.setInviteStatus = function(){
                        var ref = firebaseDataService.users;
                        var userUid = $scope.user.uid;
                        var honeyUid = $scope.honeyUid;
                        var honeyMessage = 'You\'ve received an invitation to connect from ';
                        var userMessage = 'Your invitation has been sent to ';

                        ref.child(userUid).update({
                            invitation: {
                                status: 'sent',
                                userId: honeyUid
                            }
                        }, growlerMessage());

                        ref.child(honeyUid).update({
                            invitation: {
                                status: 'received',
                                userId: userUid
                            }
                        });

                        connectService.addNotification(userUid, userMessage, honeyUid);
                        connectService.addNotification(honeyUid, honeyMessage, userUid);
                        //updateNotifications(userUid, true, honeyUid);
                        //updateNotifications(honeyUid, false);
                    };

                    var updateNotifications = function(uid, honey, honeyUid){
                        var notifications = connectService.getNotifications(uid);
                        var message = null;

                        if(honey){
                            var userData = sidenavService.getUserData(honeyUid);
                            userData.$loaded(
                                function(data){
                                    message = 'Your invitation has been sent to ' + data.firstname + ' ' + data.lastname;
                                    notifications.$add({
                                        message: message
                                    })
                                },
                                function(error){
                                    console.log(error);
                                }
                            );
                        }else {
                            message = userObj.firstname + ' ' + userObj.lastname + ' sent you an invitation to connect!';
                            notifications.$add({
                                message: message
                            });
                        }
                    };
                },
                function(error){

                }
            );

            var growlerMessage = function(){
                growl.warning('<i class="fa fa-check"></i><strong>Yay!&nbsp;</strong>You\'re invite has been sent to ' + $scope.honey, {ttl: 5000});
            };

            $scope.changeDisable = function(){
                return $scope.disable;
            };

            $scope.$watch('selectedUser', function(val){
                $scope.honey = (val) ? val.title : null;
                $scope.honeyUid = (val) ? val.originalObject.value : null;
            });

            inviteStatus.$bindTo($scope, 'status').then(function(){
                $scope.$watch('status.status', function(status){
                    if(status === 'sent' || status === 'received' || status === 'connected'){
                        $scope.disable = true;
                    }
                    if(status === 'denied' || status === 'rejected'){
                        $scope.disable = false;
                    }
                });
            });
        }]);
}(angular.module('ConnectModule')));