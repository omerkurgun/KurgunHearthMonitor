app.controller('loginController', function($scope, $http) {
    $scope.Login = function() {
        $scope.isLoading = true;
        $http({
            method: "POST",
            url: "/account/login",
            data:$.param({
                email: $scope.email,
                pass: $scope.pass
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        }).then(function(res) {
            $scope.resultMessage = res.data.message;
            $scope.isLoading = false;
        });
    };
});

//status, message, data