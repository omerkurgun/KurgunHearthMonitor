app.controller('newPasswordController', function($scope, $http) {
    $scope.NewPassword = function() {
        $scope.isLoading = true;
        $http({
            method: "POST",
            url: "/account/new-password",
            data:$.param({
                pass: $scope.pass,
                tGuid: $("#tGuid").val()
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