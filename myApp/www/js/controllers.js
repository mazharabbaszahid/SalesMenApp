/**
 * Created by 192.168.3.11 on 3/18/2016.
 */
angular.module('starter')
  .controller('loginController',function($scope,$state,$http,$rootScope){
    console.log('inside controller');
    $scope.Salesman={};

    $scope.doLogin=function(salesman){
      $scope.Salesman.SalesmanId=salesman._id;
      $http.post('http://localhost:3000/api/login',{data:salesman})
        .success(function(response){
          console.log(response);


          console.log(response.salesman._id) ;
          if(response.salesman._id){
            localStorage.setItem('SalesmanId',response.salesman._id);
            localStorage.setItem('AdminId',response.salesman.AdminId);
            $rootScope.currentUser=response.salesman;
            // console.log($rootScope.currentUser)
            $state.go('order')
          }else{
            alert("'please Enter Correct Email and Password");
            $scope.Salesman="";
          }
        })
        .error(function(err){
          console.log(err)
        })
    }
  })
.controller('ordersController',function($scope,$rootScope,$http,$state){

    $scope.order={};
    $scope.saveOrder=function(order){
      $scope.order.AdminId=localStorage.getItem('AdminId');

      $http.post('http://localhost:3000/api/order',{data:order})
        .success(function(response){
          console.log(response);
          $rootScope.orders=response.data;
          $state.go('login');
        })
        .error(function(err){
          console.log(err)
        });

    };
  });
