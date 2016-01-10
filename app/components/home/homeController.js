(function(homeModule){
    'use strict';

    homeModule.controller('homeCtrl', ['$scope', function($scope){
        //$scope.user = homeService.getUserAuth();
        //
        //if($scope.user){
        //    var userData = homeService.getUserData($scope.user.uid);
        //    userData.$loaded(
        //        function(data){
        //            $scope.username = data.username;
        //        },
        //        function(error){
        //            console.log(error);
        //        }
        //    );
        //}

    }]);
}(angular.module('HomeModule')));