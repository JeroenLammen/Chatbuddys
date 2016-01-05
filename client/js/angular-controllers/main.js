chatApp.controller("mainController", function($scope) {
    $scope.$on('$locationChangeStart', function (e, next, previous) {
        $scope.oldUrl = previous;
    });
});