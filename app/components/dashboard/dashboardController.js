(function(dashboardModule){
    'use strict';

    dashboardModule.controller('dashboardCtrl', [
        '$scope',
        'sidenavService',
        'listsService',
        'growl',
        '$interval',
        function($scope, sidenavService, listsService, growl, $interval){
            $scope.categories = ['New', 'Started', 'Finished'];
            $scope.user = sidenavService.getUserAuth();
            var categoryCount = 0;

            if($scope.user){
                var userData = sidenavService.getUserData($scope.user.uid);

                userData.$loaded(
                    function(data){
                        $scope.userObject = data;
                        if(!$scope.userObject.honey){
                            $scope.series = [$scope.userObject.username];
                        } else {
                            $scope.series = [$scope.userObject.username, $scope.userObject.honey.username];
                        }
                        $scope.categoryData = [];

                        if($scope.userObject.yourList){
                            var yourListData = listsService.getListItem($scope.user.uid, 'yourList');

                            if($scope.userObject.honey){
                                var honeyListData = listsService.getListItem($scope.user.uid, 'honeyList');
                            }

                            yourListData.$loaded(
                                function(data){
                                    $scope.categoryData[0] = getListStatusData(data);
                                    $scope.yourCategory = [$scope.categories[0], $scope.categoryData[0][0]];

                                    $interval(function(){
                                        $scope.yourCategory = [$scope.categories[categoryCount], $scope.categoryData[0][categoryCount]];
                                        if(categoryCount < ($scope.categories.length - 1)){
                                            categoryCount++;
                                        }else {
                                            categoryCount = 0;
                                        }
                                    }, 4000);

                                    if(honeyListData){
                                        honeyListData.$loaded(
                                            function(data){
                                                $scope.categoryData[1] = getListStatusData(data);
                                                $scope.honeyCategory = [$scope.categories[0], $scope.categoryData[1][0]];

                                                $interval(function(){
                                                    $scope.honeyCategory = [$scope.categories[categoryCount], $scope.categoryData[1][categoryCount]];
                                                    if(categoryCount < ($scope.categories.length - 1)){
                                                        categoryCount++;
                                                    }else {
                                                        categoryCount = 0;
                                                    }
                                                }, 4000);
                                            },
                                            function(error){
                                                growlerError(error);
                                            }
                                        );
                                    }
                                },
                                function(error){
                                    growlerError(error);
                                }
                            );
                        }else {
                            $scope.categoryData[0] = [0, 0, 0];
                        }
                    },
                    function(error){
                        growlerError(error)
                    }
                )
            }

            var growlerError = function(err){
                growl.error('<i class="fa fa-times"></i><strong>Oh shizzle my nizzle ' + err, {ttl: 5000})
            };

            var getListStatusData = function(data){
                var newCount = 0;
                var startedCount = 0;
                var finishedCount = 0;

                angular.forEach(data, function(val, i){
                    if(val.status === 'New'){
                        newCount += 1;
                    }else if(val.status === 'Started'){
                        startedCount += 1;
                    }else {
                        finishedCount += 1;
                    }
                });

                return [newCount, startedCount, finishedCount];
            };
    }]);
}(angular.module('DashboardModule')));