(function(homeModule){
    'use strict';

    homeModule.controller('homeCtrl', ['$scope', '$firebaseAuth', 'firebaseDataService', function($scope, $firebaseAuth, firebaseDataService){
        var firebaseAuthObject = $firebaseAuth(firebaseDataService.root);
        $scope.user = firebaseAuthObject.$getAuth();

    }]);
}(angular.module('HomeModule')));