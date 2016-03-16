(function(editItemModule){
    'use strict';

    editItemModule.controller('editItemCtrl', [
        '$scope',
        'authService',
        '$element',
        'listItem',
        'index',
        'close',
        'addItemService',
        'sidenavService',
        'editItemService',
        'growl',
        '$timeout',
        function($scope, authService, $element, listItem, index, close, addItemService, sidenavService, editItemService, growl, $timeout){
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
                        $scope.owners = [
                            $scope.userObject.username,
                            $scope.userObject.honey.username
                        ];

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
                                    var key = data.$keyAt(index);
                                    var item = data.$getRecord(key);

                                    if(listItem.owner !== honeydoo.honeydoo.owner){
                                        changeOwner(honeydoo, 'honeyList', 'yourList', uid);
                                    }else {
                                        item.title = honeydoo.honeydoo.title;
                                        item.due = honeydoo.honeydoo.dateDue;
                                        item.status = honeydoo.honeydoo.status;
                                        item.owner = honeydoo.honeydoo.owner;
                                        item.category = honeydoo.honeydoo.category;
                                        item.difficulty = honeydoo.honeydoo.difficulty;
                                        item.note = honeydoo.honeydoo.note;

                                        data.$save(item).then(function(){
                                            console.log('saved in yourlist');
                                            if($scope.userObject.honey && initCallback){
                                                updateHoneyList(honeydoo, $scope.userObject.honey.uid, false);
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

                        var updateHoneyList = function(honeydoo, uid, initCallback){
                            var honeyItem = editItemService.getHoneydoo(uid, 'honeyList');
                            honeyItem.$loaded(
                                function(data){
                                    var key = data.$keyAt(index);
                                    var item = data.$getRecord(key);

                                    if(listItem.owner !== honeydoo.honeydoo.owner){
                                        changeOwner(honeydoo, 'yourList', 'honeyList', uid);
                                    }else {
                                        item.title = honeydoo.honeydoo.title;
                                        item.due = honeydoo.honeydoo.dateDue;
                                        item.status = honeydoo.honeydoo.status;
                                        item.owner = honeydoo.honeydoo.owner;
                                        item.category = honeydoo.honeydoo.category;
                                        item.difficulty = honeydoo.honeydoo.difficulty;
                                        item.note = honeydoo.honeydoo.note;

                                        data.$save(item).then(function(){
                                            console.log('saved in honeylist');
                                            if(initCallback){
                                                updateYourList(honeydoo, $scope.userObject.honey.uid, false);
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

                        var changeOwner = function(honeydoo, list1, list2, uid){
                            var listOne = editItemService.getHoneydoo(uid, list1);
                            var listTwo = editItemService.getHoneydoo(uid, list2);

                            listOne.$loaded(
                                function(data){
                                    var key = data.$keyAt(index);
                                    var item = data.$getRecord(key);
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
                                            note: honeydoo.honeydoo.note
                                        })
                                    }).then(function(){
                                        closeModal();
                                    });
                                }
                            );
                        };

                        var closeModal = function(){
                            $element.modal('hide');
                            $scope.close();

                            $timeout(function(){
                                growlerSuccess('Honeydoo successfully updated!');
                            }, 500)
                        };

                        $scope.updateHoneydoo = function(honeydoo){
                            var validate = validateForm(honeydoo);

                            if(validate){
                                if(honeydoo.honeydoo.owner === $scope.userObject.username){
                                    console.log("I'm all up in this business");
                                    updateYourList(honeydoo, $scope.user.uid, true);

                                }else {
                                    console.log("I'm all up in your honey's business")
                                    updateHoneyList(honeydoo, $scope.user.uid, true);
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