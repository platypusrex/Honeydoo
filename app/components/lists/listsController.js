(function(listsModule){
    'use strict';

    listsModule.controller('listsCtrl', [
        '$scope',
        'ModalService',
        'addItemService',
        'listsService',
        'sidenavService',
        function($scope, ModalService, addItemService, listsService, sidenavService){
            $scope.user = addItemService.getUserAuth();
            $scope.yourList = addItemService.getYourList($scope.user.uid);
            $scope.honeyList = addItemService.getHoneyList($scope.user.uid);

            if($scope.user){
                var userData = sidenavService.getUserData($scope.user.uid);

                userData.$loaded(
                    function(data){
                        $scope.userObject = data;

                        $scope.editItem = function(index, list){
                            var honeyList = null;

                            if(list === 'yourList'){
                                honeyList = 'honeyList';
                            }else {
                                honeyList = 'yourList';
                            }

                            var yourTodos = listsService.getListItem($scope.user.uid, list);
                            var honeyTodos = listsService.getListItem($scope.userObject.honey.uid, honeyList);


                            yourTodos.$loaded(
                                function(data){
                                    var key = data.$keyAt(index);
                                    var listItem = data.$getRecord(key);

                                    honeyTodos.$loaded(
                                        function(data){
                                            var honeyKey = data.$keyAt(index);
                                            var honeyListItem = data.$getRecord(honeyKey);

                                            ModalService.showModal({
                                                templateUrl: 'app/components/editItem/editItem.html',
                                                controller: 'editItemCtrl',
                                                inputs: {
                                                    listItem: listItem,
                                                    honeyListItem: honeyListItem,
                                                    index: index
                                                }
                                            }).then(function(modal){
                                                modal.element.modal();
                                                modal.close.then(function(result){
                                                    console.log('i done wit da edit');
                                                })
                                            });
                                        },
                                        function(error){

                                        }
                                    );
                                }
                            );
                        };
                    },
                    function(error){

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