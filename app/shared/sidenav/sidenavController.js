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
        function($scope, sidenavService, editItemService, connectService, $state, firebaseDataService, growl, ModalService, $rootScope, $timeout){
            $scope.user = sidenavService.getUserAuth();
            $scope.iconActive1 = false;
            $scope.iconActive2 = false;
            $scope.showBadge = false;
            $scope.showDefaultNotification = true;
            $scope.username = null;
            var firstName = null;
            var lastName = null;
            var honeyId = null;
            var honeyFirstName = null;
            var honeyLastName = null;
            var honeyUserName = null;
            var chatId = null;

            var growlerAcceptMessage = function(){
                growl.warning('<i class="fa fa-check"></i><strong>Congrats!&nbsp;</strong>You\'re connected to ' + honeyFirstName + ' ' + honeyLastName, {ttl: 5000})
            };

            var growlerRejectMessage = function(){
                growl.warning('<i class="fa fa-times"></i><strong>You have rejected the connection with ' + honeyFirstName + ' ' + honeyLastName, {ttl: 5000})
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

            $scope.acceptInvite = function(){
                var ref = firebaseDataService.users;
                var chatId = sidenavService.getId();

                ref.child($scope.user.uid).update({
                    honey: {
                        uid: honeyId,
                        firstname: honeyFirstName,
                        lastname: honeyLastName,
                        username: honeyUserName
                    },
                    chatId: chatId
                }, growlerAcceptMessage());

                ref.child($scope.user.uid).child('invitation').update({
                    status: 'connected'
                });

                ref.child($scope.user.uid).once('value', function(snapshot){
                   console.log(snapshot.child('yourList').exists());
                    if(snapshot.child('yourList').exists()){
                        addHoneyList($scope.user.uid, 'yourList', ref, honeyId)
                    }
                });

                ref.child(honeyId).update({
                    honey: {
                        uid: $scope.user.uid,
                        firstname: firstName,
                        lastname: lastName,
                        username: $scope.username
                    },
                    chatId: chatId
                });

                ref.child(honeyId).child('invitation').update({
                    status: 'connected'
                });

                ref.child(honeyId).once('value', function(snapshot){
                    if(snapshot.child('yourList').exists()){
                        addHoneyList(honeyId, 'yourList', ref, $scope.user.uid);
                    }
                });

                addNotification($scope.user.uid, 'You are now connected with ' + honeyFirstName + ' ' + honeyLastName);
                addNotification(honeyId, 'You are now connected with ' + firstName + ' ' + lastName);
            };

            var addHoneyList = function(uid, list, userObject, otherUid){
                var theList = editItemService.getHoneydoo(uid, list);
                var honeyList = editItemService.getHoneydoo(otherUid, 'honeyList');

                theList.$loaded(
                    function(data){
                        angular.forEach(data, function(val, i){
                            honeyList.$add(val);
                        });
                    },
                    function(error){
                        console.log(error);
                    }
                );
            };

            $scope.rejectInvite = function(){
                var ref = firebaseDataService.users;
                ref.child(honeyId).child('invitation').update({
                    status: 'denied'
                });

                ref.child($scope.user.uid).child('invitation').update({
                    status: 'rejected'
                }, growlerRejectMessage());
            };

            var addNotification = function(uid, message){
                var notification = connectService.getNotifications(uid);

                notification.$add({
                    message: message
                });
            };

            $scope.showHoneyChat = function(){
                if(chatId){
                    saveChatCount($scope.user.uid);
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
                        console.log('hey dude')
                    });
                });
            };

            var saveChatCount = function(uid){
                var userObj = firebaseDataService.users.child(uid);
                var chatRef = firebaseDataService.chats.child(chatId);

                chatRef.once('value', function(snapshot){
                    var chatLength = snapshot.numChildren();

                    userObj.update({
                        lastChatLength: chatLength
                    })
                });
            };

            if($scope.user){
                var userData = sidenavService.getUserData($scope.user.uid);
                userData.$loaded(
                    function(data){
                        firstName = data.firstname;
                        lastName = data.lastname;
                        chatId = data.chatId;
                        $scope.username = data.username;
                        $scope.firstLastName = data.firstname + ' ' + data.lastname;
                        $scope.userIcon = (data.gender === 'his');
                        var notifications = connectService.getNotifications($scope.user.uid);

                        if(chatId) {
                            var honeyUid = data.honey.uid;
                            var chats = sidenavService.getChats(chatId);
                            var chatLength = sidenavService.currentChatLength($scope.user.uid);
                            var unread = sidenavService.getChatLengthDif($scope.user.uid);

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
                                            saveChatLengthDif($scope.chatLengthDif, $scope.user.uid, honeyUid, chats.length);
                                        });
                                        $scope.chatLengthDif = chats.length - data.$value;
                                        saveChatLengthDif($scope.chatLengthDif, $scope.user.uid, honeyUid, chats.length);
                                    });
                                }
                            );
                        }

                        notifications.$watch(function(){
                            $scope.notifications = notifications;
                            $scope.notificationIndex = 0;
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

                            console.log($scope.notifications.length);
                        });
                    },
                    function(error){
                        console.log(error);
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

                var inviteStatus = sidenavService.getInvitationStatus($scope.user.uid);
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
                                $scope.honeyName = data.firstname + ' ' + data.lastname;
                            },
                            function(error){
                                console.log(error);
                            }
                        );
                    });
                });
            }
        }
    ]);
}(angular.module('SidenavModule')));