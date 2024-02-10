app.controller('registerController', function($scope, $http) {
    $scope.Register = function() {
        $scope.isLoading = true;
        $http({
            method: "POST",
            url: "/account/register",
            data:$.param({
                nameSurname: $scope.nameSurname,
                email: $scope.email,
                pass: $scope.pass,
                termsCheck: $scope.termsCheck
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        }).then(function(res) {
            $scope.resultMessage = res.data;
            $scope.isLoading = false;
        });
    };
});