var chatApp = angular.module("chatApp", ["ngRoute", "ngCookies", "ngAnimate"]);

chatApp.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when("/login", {
            templateUrl: 'templates/login.html',
            controller: 'loginController'
        })
        .when("/", {
            templateUrl: 'templates/chat.html',
            controller: 'chatController'
        })
        .when("/about", {
            templateUrl: 'templates/about.html',
            controller: 'aboutController'
        })
        .when("/delete", {
            controller: 'deleteController',
            templateUrl: "templates/delete.html"
        })
        .otherwise({
            //resolve: { "getUrl": function() { return window.location.href}},
            redirectTo: "/404",
            templateUrl: 'templates/404.html',
            controller: "404Controller"

        });
    $locationProvider.html5Mode(true);
});