(function(authModule){
    'use strict';

    authModule.factory('authService', ['$rootScope', '$firebaseAuth', 'firebaseDataService', function($rootScope, $firebaseAuth, firebaseDataService){
        var firebaseAuthObject = $firebaseAuth(firebaseDataService.root);
        var currentUser;

        firebaseAuthObject.$onAuth(function(auth){
            currentUser = auth;
        });

        var register = function(user){
            return firebaseAuthObject.$createUser(user)
        };

        var login = function(user){
            return firebaseAuthObject.$authWithPassword(user);
        };

        var logout = function(){
            $rootScope.$broadcast('logout');
            firebaseAuthObject.$unauth();
        };

        //var isLoggedIn = function(){
        //    return currentUser;
        //};

        //var sendWelcomeEmail = function(emailAddress){
        //    firebaseDataService.users.push({
        //       emailAddress: emailAddress
        //    });
        //};

        return {
            firebaseAuthObject: firebaseAuthObject,
            register: register,
            login: login,
            logout: logout
        }
    }]);
}(angular.module('AuthModule')));