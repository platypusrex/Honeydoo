(function(addItemModule){
    'use strict';

    addItemModule.controller('addItemCtrl', [
        '$scope',
        'ModalService',
        'addItemService',
        'sidenavService',
        '$element',
        'close',
        'growl',
        function($scope, ModalService, addItemService, sidenavService, $element, close, growl){
            $scope.user = addItemService.getUserAuth();
            $scope.userObject = null;
            $scope.options = [
                'New',
                'Started',
                'Finished'
            ];

            $scope.close = function(result) {
                close(result, 500);
            };

            var growlerSuccess = function(){
                growl.warning('<i class="fa fa-check"></i><strong>Alright!&nbsp;</strong>New honeydoo saved!', {ttl: 5000})
            };

            var growlerError = function(err){
                growl.error('<i class="fa fa-times"></i><strong>Oh shizzle my nizzle ' + err, {ttl: 5000})
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

                        var saveToHoneyList = function(honeydoo, uid, initCallback){
                            var honeysList = addItemService.getHoneyList(uid);

                            honeysList.$add({
                                title: honeydoo.honeydoo.title,
                                addedOn: Firebase.ServerValue.TIMESTAMP,
                                due: honeydoo.honeydoo.dateDue,
                                status: honeydoo.honeydoo.status,
                                owner: honeydoo.honeydoo.owner,
                                note: honeydoo.honeydoo.note
                            }).then(function(){
                                if(initCallback){
                                    saveToYourList(honeydoo, $scope.userObject.honey.uid, false);
                                }
                            }).then(function(){
                                if(initCallback){
                                    $element.modal('hide');
                                    $scope.close();
                                    growlerSuccess();
                                }
                            });
                        };

                        var saveToYourList = function(honeydoo, uid, initCallback){
                            var yourListItems = addItemService.getYourList(uid);

                            yourListItems.$add({
                                title: honeydoo.honeydoo.title,
                                addedOn: Firebase.ServerValue.TIMESTAMP,
                                due: honeydoo.honeydoo.dateDue,
                                status: honeydoo.honeydoo.status,
                                owner: honeydoo.honeydoo.owner,
                                note: honeydoo.honeydoo.note
                            }).then(function(){
                                if($scope.userObject.honey && initCallback){
                                    saveToHoneyList(honeydoo, $scope.userObject.honey.uid, false);
                                }
                            }).then(function(){
                                if(initCallback){
                                    $element.modal('hide');
                                    $scope.close();
                                    growlerSuccess();
                                }
                            });
                        };

                        $scope.saveHoneydoo = function(honeydoo){
                            if(honeydoo.honeydoo.owner === $scope.userObject.username){
                                saveToYourList(honeydoo, $scope.user.uid, true);
                            }else {
                                saveToHoneyList(honeydoo, $scope.user.uid, true);
                            }
                        };
                    },
                    function(error){
                        growlerError(err);
                    }
                );
            }
    }]);
}(angular.module('AddItemModule')));