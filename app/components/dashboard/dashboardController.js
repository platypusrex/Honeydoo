(function(dashboardModule){
    'use strict';

    dashboardModule.controller('dashboardCtrl', [
        '$scope',
        'sidenavService',
        'listsService',
        'growl',
        function($scope, sidenavService, listsService, growl){
            $scope.categories = ['New', 'Started', 'Finished'];
            $scope.user = sidenavService.getUserAuth();

            if($scope.user){
                var userData = sidenavService.getUserData($scope.user.uid);

                userData.$loaded(
                    function(data){
                        $scope.userObject = data;
                        $scope.series = [$scope.userObject.username, $scope.userObject.honey.username];
                        $scope.categoryData = [];
                        var yourListData = listsService.getListItem($scope.user.uid, 'yourList');

                        if($scope.userObject.honey.uid){
                            var honeyListData = listsService.getListItem($scope.user.uid, 'honeyList');
                        }

                        yourListData.$loaded(
                            function(data){
                                $scope.categoryData[0] = getListStatusData(data);

                                if(honeyListData){
                                    honeyListData.$loaded(
                                        function(data){
                                            $scope.categoryData[1] = getListStatusData(data);
                                        },
                                        function(error){

                                        }
                                    );
                                }
                            },
                            function(error){
                                growlerError(error);
                            }
                        );
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