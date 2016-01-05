chatApp.controller("loginController", function($scope, $cookies, $location) {

    $scope.login = function(){
        if($scope.username.length > 3) {
            $cookies.put("username", $scope.username);
            if(!$cookies.get("ID")) {
                $cookies.put("ID", generateID());
            }
            $location.path("/");
        }
    };

    function generateID() {
        var userID = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 15; i++ )
            userID += possible.charAt(Math.floor(Math.random() * possible.length));
        return userID;
    }
});