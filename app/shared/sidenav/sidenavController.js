(function(sidenavModule){
    'use strict';

    sidenavModule.controller('sidenavCtrl', [
        '$scope',
        'sidenavService',
        'editItemService',
        'connectService',
        '$state',
        'firebaseDataService',
        'growl',
        'ModalService',
        '$rootScope',
        '$timeout',
        '$firebaseObject',
        function($scope, sidenavService, editItemService, connectService, $state, firebaseDataService, growl, ModalService, $rootScope, $timeout, $firebaseObject){
            $scope.user = sidenavService.getUserAuth();
            $scope.iconActive1 = false;
            $scope.iconActive2 = false;
            $scope.showBadge = false;
            $scope.showDefaultNotification = true;
            var userId = $scope.user.uid;

            var growlerSuccess = function(message){
                growl.warning('<i class="fa fa-check"></i><strong>Congrats!&nbsp;</strong>' + message, {ttl: 5000});
            };

            var growlerError = function(message){
                growl.warning('<i class="fa fa-times"></i><strong>' + message, {ttl: 5000})
            };

            $scope.getSidenavState = function(){
                return $rootScope.showSidenav;
            };

            $scope.iconToggle = function(val){
                if(val === 1){
                    $scope.iconActive1 = !$scope.iconActive1;
                }
                if(val === 2){
                    $scope.iconActive2 = !$scope.iconActive2;
                }
            };

            $scope.changeContent = function(val){
                if(val === 1){
                    $state.go('connect');
                }
            };

            $scope.removeNotification = function(item){
                var notification = firebaseDataService.users.child(userId).child('notifications').child(item.$id);
                notification.remove();
            };

            if($scope.user){
                var userData = sidenavService.getUserData(userId);
                var user = sidenavService.getUserData(userId);

                user.$bindTo($scope, 'user').then(function(){
                    $scope.$watch('user.notifications', function(notifications){
                        $scope.showDefaultNotification = (!notifications) ? true : false;
                    });
                });
                userData.$loaded(
                    function(data){
                        $scope.userObj = data;
                        var honeyId = null;
                        var honeyFirstName = null;
                        var honeyLastName = null;
                        var honeyUserName = null;
                        $scope.userIcon = (data.gender === 'his');
                        var notifications = connectService.getNotifications(userId);
                        var inviteStatus = sidenavService.getInvitationStatus(userId);

                        $scope.acceptInvite = function(){
                            var ref = firebaseDataService.users;
                            var chatId = sidenavService.getId();

                            ref.child(userId).update({
                                honey: {
                                    uid: $scope.userObj.invitation.userId,
                                    firstname: honeyFirstName,
                                    lastname: honeyLastName,
                                    username: honeyUserName
                                },
                                chatId: chatId
                            }, growlerSuccess('You\'re connected with ' + honeyFirstName + honeyLastName));

                            ref.child(userId).child('invitation').update({
                                status: 'connected'
                            });

                            ref.child(userId).once('value', function(snapshot){
                                if(snapshot.child('yourList').exists()){
                                    addHoneyList(userId, 'yourList', ref, honeyId)
                                }
                            });

                            ref.child(honeyId).update({
                                honey: {
                                    uid: honeyId,
                                    firstname: $scope.userObj.firstname,
                                    lastname: $scope.userObj.lastname,
                                    username: $scope.userObj.username
                                },
                                chatId: chatId
                            });

                            ref.child(honeyId).child('invitation').update({
                                status: 'connected'
                            });

                            ref.child(honeyId).once('value', function(snapshot){
                                if(snapshot.child('yourList').exists()){
                                    addHoneyList(honeyId, 'yourList', ref, userId);
                                }
                            });

                            connectService.addNotification(userId, 'You are now connected with ', honeyId);
                            connectService.addNotification(honeyId, 'You are now connected with ', userId);
                        };

                        var addHoneyList = function(uid, list, userObject, otherUid){
                            var theList = editItemService.getHoneydoo(userId, list);
                            var honeyList = editItemService.getHoneydoo(otherUid, 'honeyList');

                            theList.$loaded(
                                function(data){
                                    angular.forEach(data, function(val, i){
                                        honeyList.$add(val);
                                    });
                                },
                                function(error){
                                    growlerError(error);
                                }
                            );
                        };

                        $scope.rejectInvite = function(){
                            var ref = firebaseDataService.users;
                            ref.child(honeyId).child('invitation').update({
                                status: 'denied'
                            });

                            ref.child(userId).child('invitation').update({
                                status: 'rejected'
                            }, growlerError('You have rejected the connection with ' + $scope.userObj.firstname + ' ' + $scope.userObj.lastname));

                            connectService.addNotification(userId, 'You rejected an invitation from ', honeyId);
                            connectService.addNotification(honeyId, 'Your invitation was denied by ', userId);
                        };

                        $scope.showHoneyChat = function(){
                            if($scope.userObj.chatId){
                                saveChatCount(userId);
                            }

                            ModalService.showModal({
                                templateUrl: "app/components/honeyChat/honeyChat.html",
                                controller: "honeyChatCtrl"
                            }).then(function(modal) {
                                modal.element.modal();
                                $timeout(function(){
                                    $(modal.element).find('.modal-body').scrollTop($(modal.element).find('.modal-body')[0].scrollHeight);
                                }, 200);

                                modal.close.then(function(result) {
                                    console.log('honeychat closed')
                                });
                            });
                        };

                        var saveChatCount = function(uid){
                            var userObj = firebaseDataService.users.child(uid);
                            var chatRef = firebaseDataService.chats.child($scope.userObj.chatId);

                            chatRef.once('value', function(snapshot){
                                var chatLength = snapshot.numChildren();

                                userObj.update({
                                    lastChatLength: chatLength
                                })
                            });
                        };

                        if($scope.userObj.chatId) {
                            var honeyUid = $scope.userObj.honey.uid;
                            var chats = sidenavService.getChats($scope.userObj.chatId);
                            var chatLength = sidenavService.currentChatLength(userId);
                            var unread = sidenavService.getChatLengthDif(userId);

                            unread.$bindTo($scope, 'unread').then(function () {
                                $scope.$watch('unread', function(val) {
                                    $scope.showBadge = val.$value;
                                })
                            });

                            chatLength.$loaded(
                                function (data) {
                                    chats.$watch(function () {
                                        chatLength.$watch(function () {
                                            $scope.chatLengthDif = chats.length - chatLength.$value;
                                            saveChatLengthDif($scope.chatLengthDif, userID, honeyUid, chats.length);
                                        });
                                        $scope.chatLengthDif = chats.length - data.$value;
                                        saveChatLengthDif($scope.chatLengthDif, userId, honeyUid, chats.length);
                                    });
                                }
                            );

                            var saveChatLengthDif = function(val, uid, huid, length){
                                var chatLength = firebaseDataService.users.child(uid);
                                var honeyChatLength = sidenavService.currentChatLength(huid);

                                chatLength.update({
                                    unreadChats: val
                                });

                                honeyChatLength.$loaded(
                                    function(data){
                                        var honeyUnreadChats = firebaseDataService.users.child(huid);
                                        honeyUnreadChats.update({
                                            unreadChats: length - data.$value
                                        })
                                    }
                                )
                            };
                        }

                        notifications.$watch(function(){
                            $scope.notifications = notifications;
                            $scope.notificationIndex = $scope.notifications.length - 1;
                            if(notifications.length > 0){
                                $scope.showDefaultNotification = false;
                            }

                            $scope.next = function(){
                                if($scope.notificationIndex >= $scope.notifications.length - 1){
                                    $scope.notificationIndex = 0;
                                }else {
                                    $scope.notificationIndex++;
                                }
                            };

                            $scope.prev = function(){
                                if($scope.notificationIndex === 0){
                                    $scope.notificationIndex = $scope.notifications.length - 1;
                                }else {
                                    $scope.notificationIndex--;
                                }
                            };
                        });

                        inviteStatus.$bindTo($scope, 'status').then(function(){
                            honeyId = $scope.status.userId;

                            $scope.$watch('status.status', function(status){
                                $scope.value = status;
                            });

                            $scope.$watch('status.userId', function(userId){
                                var honeyData = sidenavService.getUserData(userId);

                                honeyData.$loaded(
                                    function(data){
                                        honeyFirstName = data.firstname;
                                        honeyLastName = data.lastname;
                                        honeyUserName = data.username;
                                    },
                                    function(error){
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
            }
        }
    ]);
}(angular.module('SidenavModule')));