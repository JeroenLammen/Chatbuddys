chatApp.controller("deleteController", function($http, $location) {
    console.log("deleting....");
    $http.delete("/chat")
        .success(function(){
            $location.path("/");
        })
        .error(function(){
            swal("error", "something went wrong while deleting the messages", "error");
        });
});