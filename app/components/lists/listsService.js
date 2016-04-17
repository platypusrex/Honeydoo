(function(listsModule){
    'use strict';

    listsModule.factory('listsService', ['firebaseDataService', '$firebaseArray', function(firebaseDataService, $firebaseArray){
        var getUserAuth = function(){
            return authService.firebaseAuthObject.$getAuth();
        };

        var getListItem = function(uid, list){
            var ref = firebaseDataService.users.child(uid).child(list);
            return $firebaseArray(ref);
        };

        //var getCompletedItems = function(uid, honeydoo, owner){
        //    if(owner === 'user'){
        //        var list = getListItem(uid, 'yourList');
        //        var completedList = $firebaseArray(firebaseDataService.users.child(uid).child('completed'));
        //
        //        var saveToCompletedList = function(data){
        //            completedList.$add({
        //                title: honeydoo.honeydoo.title,
        //                addedOn: data.addedOn,
        //                requesterImg: data.requesterImg,
        //                requester: data.requester,
        //                due: honeydoo.honeydoo.dateDue,
        //                status: honeydoo.honeydoo.status,
        //                owner: honeydoo.honeydoo.owner,
        //                category: honeydoo.honeydoo.category,
        //                difficulty: honeydoo.honeydoo.difficulty,
        //                note: honeydoo.honeydoo.note,
        //                itemId: data.itemId,
        //                completedOn: Firebase.ServerValue.TIMESTAMP
        //            });
        //        };
        //
        //        var checkForSameId = function(list1, list2){
        //            var foundSameId = null;
        //
        //            angular.forEach(list1, function(val){
        //                var id = val.id;
        //                angular.forEach(list2, function(item){
        //                    foundSameId = (id === item.id);
        //                });
        //            });
        //
        //            return foundSameId;
        //        };
        //
        //        list.$loaded(
        //            function(data){
        //                if(completedList.length > 0){
        //                    completedList.$loaded(
        //                        function(res){
        //                            console.log(checkForSameId(data, res));
        //                        }
        //                    )
        //                }else {
        //                    saveToCompletedList(data);
        //                }
        //            },
        //            function(error){
        //                console.log(error);
        //            }
        //        )
        //    }
        //};

        return {
            getUserAuth: getUserAuth,
            getListItem: getListItem
        }
    }]);
}(angular.module('ListsModule')));