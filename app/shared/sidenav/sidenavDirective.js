(function(sidenavModule){
    sidenavModule.directive('sidenavDirective', function(){
        return {
            restrict: 'E',
            templateUrl: 'app/shared/sidenav/sidenav.html',
            controller: 'sidenavCtrl'
        }
    });
}(angular.module('SidenavModule')));