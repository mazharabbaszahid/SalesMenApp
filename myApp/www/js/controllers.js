/**
 * Created by 192.168.3.11 on 3/18/2016.
 */
angular.module('starter')
  .controller('loginController',function($scope,$state,$http){
    console.log('inside controller');
    $scope.Salesman={};

    $scope.doLogin=function(salesman){
      $scope.Salesman.SalesmanId=salesman._id;
      $http.post('/api/login',{data:salesman})
        .success(function(response){
          localStorage.setItem('SalesmanId',response.salesman._id);

          console.log(response.user._id) ;
          if(response !==null){
            $rootScope.currentUser=response.salesman;
            // console.log($rootScope.currentUser)
            $state.go('orders')
          }else{
            alert("'please Enter Correct Email and Password");
            $scope.Salesman="";
          }
        })
        .error(function(err){
          console.log(err)
        })
    }
  });
