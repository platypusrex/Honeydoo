(function(sidenavModule){
    'use strict';

    sidenavModule.controller('sidenavCtrl', [
        '$scope',
        'sidenavService',
        '$state',
        'firebaseDataService',
        'growl',
        'ModalService',
        function($scope, sidenavService, $state, firebaseDataService, growl, ModalService){
            $scope.user = sidenavService.getUserAuth();
            $scope.iconActive1 = false;
            $scope.iconActive2 = false;
            $scope.username = null;
            var firstName = null;
            var lastName = null;
            var honeyId = null;
            var honeyFirstName = null;
            var honeyLastName = null;
            var honeyUserName = null;

            var growlerAcceptMessage = function(){
                growl.warning('<i class="fa fa-check"></i><strong>Congrats!&nbsp;</strong>You\'re connected to ' + honeyFirstName + ' ' + honeyLastName, {ttl: 5000})
            };

            var growlerRejectMessage = function(){
                growl.warning('<i class="fa fa-times"></i><strong>You have rejected the connection with ' + honeyFirstName + ' ' + honeyLastName, {ttl: 5000})
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

            $scope.showHoneyChat = function() {
                ModalService.showModal({
                    templateUrl: "app/components/honeyChat/honeyChat.html",
                    controller: "honeyChatCtrl"
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        console.log('hey dude')
                    });
                });
            };

            if($scope.user){
                var userData = sidenavService.getUserData($scope.user.uid);
                userData.$loaded(
                    function(data){
                        firstName = data.firstname;
                        lastName = data.lastname;
                        $scope.username = data.username;
                        $scope.firstLastName = data.firstname + ' ' + data.lastname;
                        $scope.userIcon = (data.gender === 'his');
                    },
                    function(error){
                        console.log(error);
                    }
                );

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