(function(dashboardModule){
    'use strict';

    dashboardModule.controller('dashboardCtrl', ['$scope', function($scope){
        $scope.labels = ['New', 'Started', 'Finished'];
        $scope.categories = ['New', 'Started', 'Finished'];
        $scope.series = ['p_rex', 'baby_girl'];
        $scope.yourData = [6, 2, 4];
        $scope.categoryData = [
            [3, 4, 5],
            [5, 2, 8]
        ];
        $scope.type = 'Pie';
    }]);
}(angular.module('DashboardModule')));