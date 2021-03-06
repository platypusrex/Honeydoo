(function(editItemModule){
    'use strict';

    editItemModule.controller('editItemCtrl', [
        '$scope',
        'authService',
        '$element',
        'listItem',
        'honeyId',
        'close',
        'addItemService',
        'sidenavService',
        'editItemService',
        'listsService',
        'growl',
        '$timeout',
        function($scope, authService, $element, listItem, honeyId, close, addItemService, sidenavService, editItemService, listsService, growl, $timeout){
            console.log(honeyId);
            $scope.user = authService.firebaseAuthObject.$getAuth();
            $scope.honeydoo = {
                title: listItem.title,
                dateDue: listItem.due,
                status: listItem.status,
                owner: listItem.owner,
                category: {
                    name: listItem.category.name,
                    group: listItem.category.group
                },
                difficulty: listItem.difficulty,
                note: listItem.note
            };
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
            $scope.close = function(result) {
                close(result, 500);
            };

            var growlerSuccess = function(message){
                growl.warning('<i class="fa fa-check"></i><strong>Alright!&nbsp;' + message, {ttl: 5000})
            };

            var growlerError = function(err){
                growl.error('<i class="fa fa-times"></i><strong>Oh shizzle my nizzle ' + err, {ttl: 5000})
            };

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

                        var updateYourList = function(honeydoo, uid, initCallback){
                            var yourItem = editItemService.getHoneydoo(uid, 'yourList');
                            yourItem.$loaded(
                                function(data){
                                    var item = data.$getRecord(listItem.$id);

                                    if(listItem.owner !== honeydoo.honeydoo.owner){
                                        changeOwner(honeydoo, 'honeyList', 'yourList', uid, $scope.userObject.honey.uid, listItem.$id, honeyId);
                                    }else {
                                        item.title = honeydoo.honeydoo.title;
                                        item.due = honeydoo.honeydoo.dateDue;
                                        item.status = honeydoo.honeydoo.status;
                                        item.owner = honeydoo.honeydoo.owner;
                                        item.category = honeydoo.honeydoo.category;
                                        item.difficulty = honeydoo.honeydoo.difficulty;
                                        item.note = honeydoo.honeydoo.note;
                                        item.completedOn = (honeydoo.honeydoo.status === 'Finished') ? Firebase.ServerValue.TIMESTAMP : null;

                                        data.$save(item).then(function(){
                                            console.log('saved in yourlist');
                                            if($scope.userObject.honey && initCallback){
                                                updateHoneyList(honeydoo, $scope.userObject.honey.uid, false, honeyId);
                                            }
                                        }).then(function(){
                                            if(initCallback){
                                                closeModal();
                                            }
                                        });
                                    }
                                },
                                function(error){

                                }
                            );
                        };

                        var updateHoneyList = function(honeydoo, uid, initCallback, id){
                            var honeyItem = editItemService.getHoneydoo(uid, 'honeyList');
                            honeyItem.$loaded(
                                function(data){
                                    var item = data.$getRecord(id);

                                    if(listItem.owner !== honeydoo.honeydoo.owner){
                                        changeOwner(honeydoo, 'yourList', 'honeyList', uid, $scope.userObject.honey.uid, listItem.$id, honeyId);
                                    }else {
                                        item.title = honeydoo.honeydoo.title;
                                        item.due = honeydoo.honeydoo.dateDue;
                                        item.status = honeydoo.honeydoo.status;
                                        item.owner = honeydoo.honeydoo.owner;
                                        item.category = honeydoo.honeydoo.category;
                                        item.difficulty = honeydoo.honeydoo.difficulty;
                                        item.note = honeydoo.honeydoo.note;
                                        item.completedOn = (honeydoo.honeydoo.status === 'Finished') ? Firebase.ServerValue.TIMESTAMP : null;

                                        data.$save(item).then(function(){
                                            if(initCallback){
                                                updateYourList(honeydoo, $scope.userObject.honey.uid, false, honeyId);
                                            }
                                        }).then(function(){
                                            if(initCallback){
                                                closeModal();
                                            }
                                        });
                                    }
                                },
                                function(error){

                                }
                            );
                        };

                        var changeOwner = function(honeydoo, list1, list2, uid, uid2, id1, id2){
                            var listOne = editItemService.getHoneydoo(uid, list1);
                            var listTwo = editItemService.getHoneydoo(uid, list2);
                            var honeyListOne = editItemService.getHoneydoo(uid2, list2);
                            var honeyListTwo = editItemService.getHoneydoo(uid2, list1);

                            listOne.$loaded(
                                function(data){
                                    var item = data.$getRecord(id1);
                                    var dateAdded = item.addedOn;

                                    listOne.$remove(item).then(function(){
                                        listTwo.$add({
                                            title: honeydoo.honeydoo.title,
                                            addedOn: dateAdded,
                                            requesterImg: $scope.userObject.image,
                                            requester: $scope.userObject.username,
                                            due: honeydoo.honeydoo.dateDue,
                                            status: honeydoo.honeydoo.status,
                                            owner: honeydoo.honeydoo.owner,
                                            category: honeydoo.honeydoo.category,
                                            difficulty: honeydoo.honeydoo.difficulty,
                                            note: honeydoo.honeydoo.note,
                                            completedOn: (honeydoo.honeydoo.status === 'Finished') ? Firebase.ServerValue.TIMESTAMP : null
                                        })
                                    }).then(function(){
                                        closeModal();
                                    });
                                }
                            );

                            honeyListOne.$loaded(
                                function(data){
                                    var item = data.$getRecord(id2);
                                    var dateAdded = item.addedOn;

                                    honeyListOne.$remove(item).then(function(){
                                        honeyListTwo.$add({
                                            title: honeydoo.honeydoo.title,
                                            addedOn: dateAdded,
                                            requesterImg: $scope.userObject.image,
                                            requester: $scope.userObject.username,
                                            due: honeydoo.honeydoo.dateDue,
                                            status: honeydoo.honeydoo.status,
                                            owner: honeydoo.honeydoo.owner,
                                            category: honeydoo.honeydoo.category,
                                            difficulty: honeydoo.honeydoo.difficulty,
                                            note: honeydoo.honeydoo.note,
                                            completedOn: (honeydoo.honeydoo.status === 'Finished') ? Firebase.ServerValue.TIMESTAMP : null
                                        })
                                    });
                                }
                            )
                        };

                        var closeModal = function(){
                            $element.modal('hide');
                            $scope.close();

                            $timeout(function(){
                                growlerSuccess('Honeydoo successfully updated!');
                            }, 500)
                        };

                        var saveCompletedHoneydoo = function(uid){
                            var completed = listsService.getCompletedItems(uid);
                            completed.$add({
                                title: honeydoo.honeydoo.title,
                                addedOn: dateAdded,
                                requesterImg: $scope.userObject.image,
                                requester: $scope.userObject.username,
                                due: honeydoo.honeydoo.dateDue,
                                status: honeydoo.honeydoo.status,
                                owner: honeydoo.honeydoo.owner,
                                category: honeydoo.honeydoo.category,
                                difficulty: honeydoo.honeydoo.difficulty,
                                note: honeydoo.honeydoo.note,
                                completedOn: Firebase.ServerValue.TIMESTAMP
                            });
                        };

                        $scope.updateHoneydoo = function(honeydoo){
                            var validate = validateForm(honeydoo);

                            if(validate){
                                if(honeydoo.honeydoo.owner === $scope.userObject.username){
                                    updateYourList(honeydoo, $scope.user.uid, true, listItem.$id);

                                }else {
                                    updateHoneyList(honeydoo, $scope.user.uid, true, listItem.$id);
                                }
                            }else {
                                $scope.error = 'field required';
                            }
                        };
                    },
                    function(error){
                        growlerError(error)
                    }
                )
            }

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
    }]);
}(angular.module('EditItemModule')));