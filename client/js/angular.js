var chatApp = angular.module("chatApp", ["ngRoute"]);

chatApp.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: 'templates/home.html',
            controller: 'loginController'
        })
        .when("/chat", {
            templateUrl: 'templates/chat.html',
            controller: 'chatController'
        });
    $locationProvider.html5Mode(true);
});


chatApp.controller("loginController", function($scope, $http, socket) {
    alert("loginController");
    //PLAATS HIER JAVASCRIPT VOOR DE LOGIN PAGINA
});


chatApp.controller("chatController", function($scope, $http, socket) {
    alert("chatController");
    //PLAATS HIER JAVASCRIPT VOOR DE CHAT PAGINA

});