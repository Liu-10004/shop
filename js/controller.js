angular.module('appModule.controller',[])
.controller('homeCtrl',function ($scope,$sce,Book) {
    $scope.title = $sce.trustAsHtml('<h1>二手商品，应有尽有</h1>');
    $('.carousel').carousel({interval:2000});
}).controller('listCtrl',function ($scope,Book){
    $scope.products=Book.query();
})
.controller('addCtrl',function ($scope,Book,$location){
    $scope.add=function (){
    Book.save($scope.product).$promise.then(function (){
        $location.path('/list');
    })
    }
})
.controller('signupCtrl',function ($scope,Book,$location){

})
.controller('detailCtrl',function ($scope,$routeParams,Book,$location){
    var id=$routeParams.id;
    Book.get({id:id}).$promise.then(function (data){
        $scope.product=data;
    })
    $scope.flag=true;
    $scope.changeFlag=function (){
        $scope.flag=false;
        $scope.temp=JSON.parse(JSON.stringify($scope.product));
    }
    $scope.remove=function (){
        Book.delete({id:id}).$promise.then(function (){
            $location.path('/list');
        })
    }
    $scope.update=function (){
        Book.update({id:id},$scope.temp).$promise.then(function (){
            $scope.product=$scope.temp;
            $scope.flag=true;
        })
    }
})