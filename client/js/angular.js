chatApp.controller("mainController", function($scope) {
    $scope.$on('$locationChangeStart', function (e, next, previous) {
        $scope.oldUrl = previous;
    });
});

chatApp.controller("deleteController", function($scope, $http, $location) {
    console.log("deleting....");
    $http.delete("/chat")
        .success(function(){
            $location.path("/");
        })
        .error(function(){
            swal("error", "something went wrong while deleting the messages", "error");
        });
});

chatApp.controller("loginController", function($scope, $http, socket, $cookies, $location) {
    $scope.tochat = function(){
        $cookies.put("username", $scope.username);
        $location.path("/");
    }
});

chatApp.controller("chatController", function($scope, $http, socket, $cookies, $location) {
    //CHECK IF USERNAME IS ENTERED
    $cookies.get("username") ? $scope.username = $cookies.get("username") : $location.path('/login');

    //GET ALL MESSAGES
    $http.get("/chat")
        .success(function(data){
            for(var i =0; i<data.length; i++){
                $scope.messages.push(data[i]);
            }
        })
        .error(function(err){
            swal("error", err, "error");
        });

    //WEBRTC
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    function successCallback(localMediaStream) {
        window.stream = localMediaStream; // stream available to console
        console.log("successcallback");
        if ($('video').length === 0) {
            $("#messageWindow").append("<video><video>");
            var video = document.querySelector("video");
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        } else {
            var video = document.querySelector("video");
            //window.stream.stop();
            video.src = null;
            video.remove();
        }
    }

    function errorCallback(error){
        console.log("navigator.getUserMedia error: ", error);
    }

    var constraints = {
            video: false,
            audio: false
        };

    $scope.requestCamera = function() {
        constraints.video = true;
        navigator.getUserMedia(constraints, successCallback, errorCallback);
    };

    $scope.fa_icon = 'fa fa-microphone fa-2x';

    $scope.requestMicrophone = function() {
        if(!constraints.audio){
            constraints.audio = true;
            navigator.getUserMedia(constraints, successCallback, errorCallback);
            $scope.fa_icon = 'fa fa-microphone-slash fa-2x';
        } else {
            constraints.audio = false;
            $scope.fa_icon = 'fa fa-microphone fa-2x';
            if(constraints.video){
                navigator.getUserMedia(constraints, successCallback, errorCallback);
            } else {
                $("video").remove();
            }
        }


    };

    //FILE UPLOAD
    $scope.openFile = function() {
        $("#target").click();
    };

    $scope.messages = [];

    $scope.usersOnline = ["Frits", "Karel", "Kees", "Piet", "Jan", "Frits", "Karel", "Kees", "Piet", "Jan", "Frederik", "Jan Willem", "Peter", "Sjaak", "Isabella", "Emma"];


    //SEND MESSAGE
    $scope.send = function($event){
        if($event.keyCode == 13){
            $scope.newMessage = {
                author: $scope.username,
                body: $scope.message,
                date: Date.now(),
                file: $scope.file
            };
            //$scope.messages.push($scope.newMessage);
            $scope.message = '';
            socket.emit("sendMessage", $scope.newMessage);
        }
    };

    socket.on("incorrect", function(err){
        swal("error", err, "error");
    });

    socket.on("message", function(message){
        //if(message.author !== $cookies.get("username")) {
            $scope.messages.push(message);
            //swal("Saved Message", message.body, "success");
       // }
    });

    //NOTIFICATIONS
    var notificationsEnabled = false;

    $scope.sliderChange = function() {
        var slider = $("#sliderPosition");
        if(!notificationsEnabled){
            slider.css("background-color", "lightgrey");
        } else {
            slider.css("background-color", "#3498db");
        }
        notificationsEnabled = !notificationsEnabled;
    };

    //SCROLLBAR
    window.onload = function(){
        if(!navigator.userAgent.match('Macintosh')){
            var element = document.querySelectorAll('.slimScroll');
            // Apply slim scroll plugin
            var one = new slimScroll(element[0], {
                'wrapperClass': 'scroll-wrap',
                'scrollBarContainerClass': 'scrollBarContainer',
                //'scrollBarContainerSpecialClass': 'animate',
                'scrollBarClass': 'scroll-bar',
                'keepFocus': true
            });

            // resize example
            // To make the resizing work, set the height of the container in PERCENTAGE
            window.onresize = function(){
                one.resetValues();
            }
        } else {
            document.write("For Mac users, this custom slimscroll styles will not be applied");
        }
    };

    //slimscroll won't load without a timeout
    setTimeout(function(){
        window.onload();
    },100);

});

chatApp.controller("aboutController", function($scope, $http, socket, $cookies, $location) {
    $scope.randomValue = 'a random angular variable';
});

chatApp.controller("404Controller", function($scope, $http, socket, $cookies, $location) {
    $scope.error = 'you\'ve just been redirected to this 404 page';
    console.log("404");
});