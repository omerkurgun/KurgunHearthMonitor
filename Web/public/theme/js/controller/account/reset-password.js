app.controller('resetPasswordController', function($scope, $http) {
    $scope.ResetPassword = function() {
        $scope.isLoading = true;
        $http({
            method: "POST",
            url: "/account/reset-password",
            data:$.param({
                email: $scope.email
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