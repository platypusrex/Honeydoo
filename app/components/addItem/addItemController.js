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
            $scope.error = false;
            $scope.options = [
                'New',
                'Started',
                'Finished'
            ];
            var categoryData = addItemService.getCategories();

            $scope.close = function(result) {
                close(result, 500);
            };

            var growlerSuccess = function(){
                growl.warning('<i class="fa fa-check"></i><strong>Alright!&nbsp;</strong>New honeydoo saved!', {ttl: 5000})
            };

            var growlerError = function(err){
                growl.error('<i class="fa fa-times"></i><strong>Oh shizzle my nizzle ' + err, {ttl: 5000})
            };

            categoryData.$loaded(
                function(data){
                    $scope.categories = {};

                    angular.forEach(data, function(val, key){
                        var k = key;
                        angular.forEach(val, function(val, key){
                            $scope.categories[key] = {name: key, group: k};
                        });
                    });
                },
                function(error){
                    growlerError(error);
                }
            );

            if($scope.user){
                var userData = sidenavService.getUserData($scope.user.uid);

                userData.$loaded(
                    function(data){
                        $scope.userObject = data;
                        $scope.owners = [
                            $scope.userObject.username,
                            $scope.userObject.honey.username
                        ];

                        var validateForm = function(honeydoo){
                            console.log(honeydoo);
                            if(!honeydoo.honeydoo){
                                return false;
                            }
                            return (honeydoo.honeydoo.title && honeydoo.honeydoo.dateDue && honeydoo.honeydoo.status && honeydoo.honeydoo.owner && honeydoo.honeydoo.note) ? true : false;
                        };

                        var saveToHoneyList = function(honeydoo, uid, initCallback){
                            var honeysList = addItemService.getHoneyList(uid);

                            honeysList.$add({
                                title: honeydoo.honeydoo.title,
                                addedOn: Firebase.ServerValue.TIMESTAMP,
                                due: honeydoo.honeydoo.dateDue,
                                status: honeydoo.honeydoo.status,
                                owner: honeydoo.honeydoo.owner,
                                category: honeydoo.honeydoo.category,
                                note: honeydoo.honeydoo.note,
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
                                category: honeydoo.honeydoo.category,
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

                        $scope.resetForm = function(){
                            $scope.error = false;
                        };

                        $scope.saveHoneydoo = function(honeydoo){
                            var validate = validateForm(honeydoo);
                            console.log(validate);
                            if(validate){
                                if(honeydoo.honeydoo.owner === $scope.userObject.username){
                                    saveToYourList(honeydoo, $scope.user.uid, true);
                                }else {
                                    saveToHoneyList(honeydoo, $scope.user.uid, true);
                                }
                            }else {
                                $scope.error = 'field required';
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