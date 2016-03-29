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
            $scope.submitted = false;
            $scope.options = [
                'New',
                'Started',
                'Finished'
            ];
            $scope.taskDifficulty = [
                'Easy',
                'Medium',
                'Hard'
            ];
            var categoryData = addItemService.getCategories();
            var itemId = null;

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
                    $scope.categories = [];

                    angular.forEach(data, function(val, key){
                        var k = key;
                        angular.forEach(val, function(val, key){
                            this.push({name: key, group: k});
                        }, $scope.categories);
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
                        if($scope.userObject.honey){
                            $scope.owners = [
                                $scope.userObject.username,
                                $scope.userObject.honey.username
                            ];
                        }else {
                            $scope.owners = [
                                $scope.userObject.username
                            ];
                        }

                        var validateForm = function(honeydoo){
                            if(!honeydoo.honeydoo){
                                return false;
                            }
                            return (honeydoo.honeydoo.title && honeydoo.honeydoo.dateDue && honeydoo.honeydoo.status && honeydoo.honeydoo.owner && honeydoo.honeydoo.note && honeydoo.honeydoo.category && honeydoo.honeydoo.difficulty) ? true : false;
                        };

                        var saveToHoneyList = function(honeydoo, uid, initCallback){
                            var honeysList = addItemService.getHoneyList(uid);

                            honeysList.$add({
                                title: honeydoo.honeydoo.title,
                                addedOn: Firebase.ServerValue.TIMESTAMP,
                                requesterImg: $scope.userObject.image,
                                requester: $scope.userObject.username,
                                due: honeydoo.honeydoo.dateDue,
                                status: honeydoo.honeydoo.status,
                                owner: honeydoo.honeydoo.owner,
                                category: honeydoo.honeydoo.category,
                                difficulty: honeydoo.honeydoo.difficulty,
                                note: honeydoo.honeydoo.note,
                                itemId: itemId
                            }).then(function(){
                                if(initCallback){
                                    saveToYourList(honeydoo, $scope.userObject.honey.uid, false);
                                }
                            }).then(function(){
                                if(initCallback){
                                    closeModal();
                                }
                            });
                        };

                        var saveToYourList = function(honeydoo, uid, initCallback){
                            var yourListItems = addItemService.getYourList(uid);

                            yourListItems.$add({
                                title: honeydoo.honeydoo.title,
                                addedOn: Firebase.ServerValue.TIMESTAMP,
                                requesterImg: $scope.userObject.image,
                                requester: $scope.userObject.username,
                                due: honeydoo.honeydoo.dateDue,
                                status: honeydoo.honeydoo.status,
                                owner: honeydoo.honeydoo.owner,
                                category: honeydoo.honeydoo.category,
                                difficulty: honeydoo.honeydoo.difficulty,
                                note: honeydoo.honeydoo.note,
                                itemId: itemId
                            }).then(function(){
                                if($scope.userObject.honey && initCallback){
                                    saveToHoneyList(honeydoo, $scope.userObject.honey.uid, false);
                                }
                            }).then(function(){
                                if(initCallback){
                                    closeModal();
                                }
                            });
                        };

                        var closeModal = function(){
                            $element.modal('hide');
                            $scope.close();

                            $timeout(function(){
                                growlerSuccess('Honeydoo successfully updated!');
                            }, 500)
                        };

                        $scope.resetForm = function(){
                            $scope.submitted = false;
                        };

                        $scope.saveHoneydoo = function(honeydoo){
                            $scope.submitted = true;
                            var validate = validateForm(honeydoo);
                            itemId = sidenavService.getId();

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