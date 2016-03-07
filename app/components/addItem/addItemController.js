(function(addItemModule){
    'use strict';

    addItemModule.controller('addItemCtrl', [
        '$scope',
        'ModalService',
        'addItemService',
        'sidenavService',
        function($scope, ModalService, addItemService, sidenavService){
            $scope.user = addItemService.getUserAuth();
            $scope.userObject = null;

            $scope.close = function(result) {
                close(result, 500);
            };

            if($scope.user){
                var userData = sidenavService.getUserData($scope.user.uid);

                userData.$loaded(
                    function(data){
                        $scope.userObject = data;
                        $scope.owners = [
                            $scope.userObject.username,
                            $scope.userObject.honey.username
                        ];

                        var yourList = addItemService.getYourList($scope.user.uid);
                        if($scope.userObject.honey){
                            var honeyList = addItemService.getHoneyList($scope.userObject.honey.uid);

                            var saveToHoney = function(honeydoo){
                                honeyList.$add({
                                    title: honeydoo.honeydoo.title,
                                    due: honeydoo.honeydoo.dateDue,
                                    status: honeydoo.honeydoo.status,
                                    owner: honeydoo.honeydoo.owner,
                                    note: honeydoo.honeydoo.note
                                });
                            };
                        }

                        $scope.saveHoneydoo = function(honeydoo){
                            yourList.$add({
                                title: honeydoo.honeydoo.title,
                                due: honeydoo.honeydoo.dateDue,
                                status: honeydoo.honeydoo.status,
                                owner: honeydoo.honeydoo.owner,
                                note: honeydoo.honeydoo.note
                            }).then(function(){
                                if(saveToHoney){
                                    saveToHoney(honeydoo);
                                }
                            }).then(function(){
                                $scope.close();
                            });
                        };
                    },
                    function(error){

                    }
                );
            }

            $scope.options = [
                'New',
                'Started',
                'Finished'
            ];
            //$scope.owners = [
            //    'His',
            //    'Hers'
            //];
    }]);
}(angular.module('AddItemModule')));