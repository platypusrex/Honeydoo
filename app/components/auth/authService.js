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

        //function isLoggedIn(){
        //    var currentUser = null;
        //    firebaseAuthObject.$onAuth(function(auth){
        //        currentUser =  auth;
        //        console.log(currentUser);
        //    });
        //
        //    return currentUser;
        //}

        //var sendWelcomeEmail = function(emailAddress){
        //    firebaseDataService.users.push({
        //       emailAddress: emailAddress
        //    });
        //};

        return {
            firebaseAuthObject: firebaseAuthObject,
            currentUser: currentUser,
            register: register,
            login: login,
            logout: logout
        }
    }]);
}(angular.module('AuthModule')));