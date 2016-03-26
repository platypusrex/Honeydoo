(function(landingModule){
    'use strict';

    landingModule.controller('landingCtrl', ['$scope','ModalService', function($scope, ModalService){
        $scope.showRegister = function(){
            ModalService.showModal({
                templateUrl: "app/components/auth/register.html",
                controller: "authCtrl"
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    console.log('hey dude')
                });
            });
        };
    }]);
}(angular.module('LandingModule')));