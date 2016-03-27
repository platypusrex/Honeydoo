(function(listsModule){
    'use strict';

    listsModule.controller('listsCtrl', [
        '$scope',
        'ModalService',
        'addItemService',
        'listsService',
        'sidenavService',
        'growl',
        function($scope, ModalService, addItemService, listsService, sidenavService, growl){
            $scope.user = addItemService.getUserAuth();
            $scope.yourList = addItemService.getYourList($scope.user.uid);
            $scope.honeyList = addItemService.getHoneyList($scope.user.uid);
            $scope.pageSize = 4;
            $scope.currentPage1 = 1;
            $scope.currentPage2 = 1;
            $scope.showQuery = false;
            $scope.showSort = false;
            $scope.showButtonGroup = true;
            var absolute_index = null;

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

            if($scope.user){
                var userData = sidenavService.getUserData($scope.user.uid);

                userData.$loaded(
                    function(data){
                        $scope.userObject = data;

                        $scope.editItem = function(index, list){
                            var honeyList = null;
                            var thisList = (list === 'yourList') ? $scope.currentPage1 : $scope.currentPage2;
                            absolute_index = index + (thisList - 1) * $scope.pageSize;

                            if(list === 'yourList'){
                                honeyList = 'honeyList';
                            }else {
                                honeyList = 'yourList';
                            }

                            var yourTodos = listsService.getListItem($scope.user.uid, list);

                            yourTodos.$loaded(
                                function(data){
                                    var key = data.$keyAt(absolute_index);
                                    var listItem = data.$getRecord(key);

                                    ModalService.showModal({
                                        templateUrl: 'app/components/editItem/editItem.html',
                                        controller: 'editItemCtrl',
                                        inputs: {
                                            listItem: listItem,
                                            index: absolute_index
                                        }
                                    }).then(function(modal){
                                        modal.element.modal();
                                        modal.close.then(function(result){
                                            console.log('i done wit da edit');
                                        })
                                    });
                                }
                            );
                        };

                        $scope.removeItem = function(index, list){
                            var otherList = null;
                            var thisList = (list === 'yourList') ? $scope.currentPage1 : $scope.currentPage2;
                            absolute_index = index + (thisList - 1) * $scope.pageSize;

                            if(list === 'yourList'){
                                otherList = 'honeyList';
                            }else {
                                otherList = 'yourList';
                            }

                            var listOne = listsService.getListItem($scope.user.uid, list);
                            remove(listOne, absolute_index);

                            if($scope.userObject.honey){
                                var listTwo = listsService.getListItem($scope.userObject.honey.uid, otherList);
                                remove(listTwo, absolute_index, true);
                            }
                        };

                        var remove = function(list, index, initCallback){
                            list.$loaded(
                                function(data){
                                    var key = data.$keyAt(index);
                                    var item = data.$getRecord(key);

                                    list.$remove(item).then(function(){
                                        if(initCallback){
                                            growlerSuccess('Successfully deleted honeydoo');
                                        }
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