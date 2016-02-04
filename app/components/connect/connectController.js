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
            var usersData = connectService.getUsers();
            var inviteStatus = sidenavService.getInvitationStatus($scope.user.uid);

            usersData.$loaded(
                function(data){
                    var users = [];
                    angular.forEach(data, function(val, i){
                        if(val.$id !== $scope.user.uid && val.invitation.status !== 'connected' && val.invitation.status !== 'sent' && val.invitation.status !== 'received'){
                            this.push({option: val.firstname + ' ' + val.lastname, value: val.$id});
                        }
                    }, users);

                    $timeout(function(){
                        $scope.selectData = {
                            availableUsers: users
                        };
                        $timeout(function(){
                            $('select').selectpicker('refresh');
                        });
                    });
                },
                function(error){
                    console.log(error);
                }
            );

            var growlerMessage = function(){
                growl.warning('<i class="fa fa-check"></i><strong>Yay!&nbsp;</strong>You\'re invite has been sent to ' + $scope.honey, {ttl: 5000})
            };

            $scope.setInviteStatus = function(){
                var ref = firebaseDataService.users;
                var userUid = $scope.user.uid;
                var honeyUid = $scope.honeyUid;

                ref.child(userUid).update({
                    invitation: {
                        status: 'sent',
                        userId: honeyUid,
                        notification: 'Your invitation has been sent to'
                    }
                }, growlerMessage());

                ref.child(honeyUid).update({
                    invitation: {
                        status: 'received',
                        userId: userUid,
                        notification: 'sent you an invitation to connect!'
                    }
                });
            };

            $scope.$watch('myModel', function(val){
                $scope.honey = (val) ? val[0].option : null;
                $scope.honeyUid = (val) ? val[0].value : null;
                console.log($scope.honeyUid);
            });

            inviteStatus.$bindTo($scope, 'status').then(function(){
                $scope.$watch('status.status', function(status){
                    if(status === 'sent' || status === 'received' || status === 'connected'){
                        $scope.disable = true;
                    }
                    console.log($scope.disable);
                });
            });
            console.log($scope.disable);
        }]);
}(angular.module('ConnectModule')));