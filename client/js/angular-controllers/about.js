chatApp.controller("aboutController", function($scope, $http) {
    $scope.randomValue = 'a random angular variable';
    //var file;

    $scope.upload = function(){
        var selectedFile = $('#target').get(0).files[0];
        console.log(selectedFile);
        //var filez = $scope.myFile;


        var fd = new FormData();
        fd.append('file', selectedFile);

        console.log("uploading....");
        $http.post("/uploads", fd, {
            transformRequest: angular.identity,
            headers: {"Content-Type": undefined}
        })
        .success(function(data){
            console.log("gelukt!");
        })
        .error(function(error){
            console.log("error!");
        });
    }

});