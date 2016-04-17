(function(listsModule){
    'use strict';

    listsModule.controller('listsCtrl', [
        '$scope',
        'ModalService',
        'addItemService',
        'listsService',
        'sidenavService',
        'firebaseDataService',
        '$firebaseArray',
        'growl',
        function($scope, ModalService, addItemService, listsService, sidenavService, firebaseDataService, $firebaseArray, growl){
            $scope.user = addItemService.getUserAuth();
            $scope.yourList = addItemService.getYourList($scope.user.uid);
            $scope.honeyList = addItemService.getHoneyList($scope.user.uid);
            $scope.pageSize = 4;
            $scope.currentPage1 = 1;
            $scope.currentPage2 = 1;
            $scope.showQuery = false;
            $scope.showSort = false;
            $scope.showButtonGroup = true;
            var yourCompletedList = addItemService.getYourList($scope.user.uid);
            var honeyCompletedList = addItemService.getHoneyList($scope.user.uid);

            yourCompletedList.$watch(function(){
                $scope.yourComplete = yourCompletedList.filter(function(val){
                    if(val.status === 'Finished'){
                        return val;
                    }
                });
            });

            honeyCompletedList.$watch(function(){
                $scope.honeyComplete = honeyCompletedList.filter(function(val){
                    if(val.status === 'Finished'){
                        return val;
                    }
                });
            });

            var growlerSuccess = function(message){
                growl.warning('<i class="fa fa-check"></i><strong>Alright!&nbsp;' + message, {ttl: 5000})
            };

            var growlerError = function(err){
                growl.error('<i class="fa fa-times"></i><strong>Oh shizzle my nizzle ' + err, {ttl: 5000})
            };

            $scope.showSearch = function(option){
                if(option === 'search'){
                    $scope.showQuery = !$scope.showQuery;
                }
                if(option === 'sort'){
                    $scope.showSort = !$scope.showSort;
                }
                $scope.showButtonGroup = !$scope.showButtonGroup;
            };

            $scope.pageChangeHandler = function(num, list){
                if(list === 'yours'){
                    $scope.currentPage1 = num;
                }else {
                    $scope.currentPage2 = num;
                }
            };

            var getHoneyListItem = function(uid, list, itemId){
                var honeyList = listsService.getListItem(uid, list);
                var id = [];

                honeyList.$loaded(
                    function(data){
                        angular.forEach(data, function(val){
                            if(val.itemId === itemId){
                                honeyList.$remove(val).then(function(){
                                    growlerSuccess('Successfully deleted honeydoo!');
                                });
                            }
                        });
                    },
                    function(error){
                        growlerError(error);
                    }
                );
            };

            if($scope.user){
                var userData = sidenavService.getUserData($scope.user.uid);

                userData.$loaded(
                    function(data){
                        $scope.userObject = data;

                        $scope.removeHoneydoo = function(item, list){
                            if(list === 'yourList'){
                                $scope.yourList.$remove(item);
                                getHoneyListItem($scope.userObject.honey.uid, 'honeyList', item.itemId)
                            }else {
                                $scope.honeyList.$remove(item);
                                getHoneyListItem($scope.userObject.honey.uid, 'yourList', item.itemId);
                            }
                        };

                        $scope.editItem = function(index, list, item){
                            var honeyList = null;

                            if(list === 'yourList'){
                                honeyList = listsService.getListItem($scope.userObject.honey.uid, 'honeyList');
                            }else {
                                honeyList = listsService.getListItem($scope.userObject.honey.uid, 'yourList');
                            }

                            honeyList.$loaded(
                                function(data){
                                    var id = '';
                                    angular.forEach(data, function(val){
                                        if(val.itemId === item.itemId){
                                            id = val.$id;
                                        }
                                    });

                                    ModalService.showModal({
                                        templateUrl: 'app/components/editItem/editItem.html',
                                        controller: 'editItemCtrl',
                                        inputs: {
                                            listItem: item,
                                            honeyId: id
                                        }
                                    }).then(function(modal){
                                        modal.element.modal();
                                        modal.close.then(function(result){
                                            console.log('i done wit da edit');
                                        })
                                    });
                                },
                                function(error){
                                    growlerError(error);
                                }
                            );

                        };
                    },
                    function(error){
                        growlerError(error);
                    }
                )
            }

            $scope.showAddItem = function(){
                ModalService.showModal({
                    templateUrl: 'app/components/addItem/addItem.html',
                    controller: 'addItemCtrl'
                }).then(function(modal){
                    modal.element.modal();
                    modal.close.then(function(result){
                        console.log('the dishes are done');
                    });
                });
            };

    }]);
}(angular.module('ListsModule')));