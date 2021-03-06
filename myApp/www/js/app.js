// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])
.config(function($urlRouterProvider,$stateProvider){
  $stateProvider
    .state('login',{
      url:'/login',
      templateUrl:'./templates/login.html',
      controller:'loginController'
    })
    .state('order',{
      url:'/order',
      templateUrl:"./templates/orders.html",
      controller:'ordersController'
    });
    $urlRouterProvider.otherwise('login')
  });

