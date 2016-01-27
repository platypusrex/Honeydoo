(function(connectModule){
    'use strict';

    connectModule.controller('connectCtrl', [
        '$scope',
        'connectService',
        '$timeout',
        'sidenavService',
        'firebaseDataService',
        function($scope, connectService, $timeout, sidenavService, firebaseDataService){
        $scope.user = connectService.getUserAuth();
        $scope.honeyUid = null;
        var usersData = connectService.getUsers();

        usersData.$loaded(
            function(data){
                var users = [];
                angular.forEach(data, function(val, i){
                    if(val.$id !== $scope.user.uid){
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

        $scope.setInviteStatus = function(){
            console.log('howdy');
            //if(myModel){
                var ref = firebaseDataService.users;
                var userUid = $scope.user.uid;
                var honeyUid = $scope.honeyUid;

                ref.child(userUid).update({
                    invitation: 'sent'
                }, function(){
                    alert('Yay for hamburgers!');
                });

                ref.child(honeyUid).update({
                    invitation: 'received'
                }, function(){
                    alert('Update successful!');
                });
            //}
        };

        $scope.$watch('myModel', function(val){
            $scope.honey = (val) ? val[0].option : null;
            $scope.honeyUid = (val) ? val[0].value : null;
            console.log($scope.honeyUid);
        });

    }]);
}(angular.module('ConnectModule')));