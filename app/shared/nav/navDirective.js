(function(navModule){
    navModule.directive('navDirective', function(){
        return {
            restrict: 'E',
            templateUrl: 'app/shared/nav/nav.html',
            controller: 'navCtrl'
        }
    });
}(angular.module('NavModule')));