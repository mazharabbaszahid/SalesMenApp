angular.module("starter")
    .service("salesService", function ($http, $state, $q, $location) {
        var userInfo = {};
        var companyInfo={}
        var salesmenInfo=[]

        this.getUserInfo = function () {
            var deferred = $q.defer();
            
           var firebaseToken=localStorage.getItem('token')
        $http.get('/api/'+ firebaseToken).then(
                function (success) {
                    userInfo = success.data;
                    
                    
                    deferred.resolve(userInfo);
                    
                },
                function (err) {
                    deferred.resolve(err);
                });
            return deferred.promise;
        }
        
    //******************************************//    
        this.getCompanyInfo = function () {
           var deferred = $q.defer();
            
           var AdminId=localStorage.getItem('AdminId')
           
        $http.get('/api/viewCompany/'+AdminId).then(

                function (success) {
                    companyInfo = success.data;                   
                    // companyInfo.adminId = userInfo.AdminId;
                    deferred.resolve(companyInfo);
                    
                },
                function (err) {
                    deferred.resolve(err);
                });
            return deferred.promise;
        }
         
     
//              .....Salesmen details.....
     //************************************//
      this.getSalesmen = function () {
           var deferred = $q.defer();
            
           var AdminId=localStorage.getItem('AdminId')
           
        $http.get('/api/viewSalesmen/'+ AdminId).then(

                function (success) {
                    salesmenInfo = success.data;                   
                    // companyInfo.adminId = userInfo.AdminId;
                    deferred.resolve(salesmenInfo);
                    
                },
                function (err) {
                    deferred.resolve(err);
                });
            return deferred.promise;
        }
        
        //==============================//
        //==========view orders========//
        
        this.getOrders = function () {
           var deferred = $q.defer();
            
           //var AdminId=localStorage.getItem('AdminId')
           
        $http.get('/api/viewOrder/'+ id).then(

                function (success) {
                    orderInfo = success.data;                   
                    deferred.resolve(orderInfo);
                    
                },
                function (err) {
                    deferred.resolve(err);
                });
            return deferred.promise;
        }
         
     });
    