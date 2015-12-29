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
                data[i].date = setDate(data[i].date);
                if(data[i].author === $scope.username){
                    data[i].self = "self";
                } else {
                    data[i].self = "other";
                }
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
            $("#messageWindow").append("<video></video>");
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
                date: Date(),
                file: $scope.file
            };
            //$scope.messages.push($scope.newMessage);
            $scope.message = '';
            socket.emit("sendMessage", $scope.newMessage);
        }
        if($scope.message){
            socket.emit("typing", $scope.username);
        } else {
            socket.emit("stoppedtyping", $scope.username);
        }
    };

    socket.on("incorrect", function(err){
        swal("error", err, "error");
    });

    socket.on("message", function(message){
        $("#messageWindow").removeAttr("data-slimscroll");
        $(".scroll-wrap > #allMessages").unwrap();
        $(".scrollBarContainer").remove();
        //if(message.author !== $cookies.get("username")) {
            message.date = setDate(message.date);
            if(message.author === $scope.username){
                message.self = "self";
            } else {
                message.self = "other";
            }
            $scope.messages.push(message);
        createNotification(message, true);

        var element = document.querySelectorAll('.slimScroll');
        var two = new slimScroll(element[1], {
            'wrapperClass': 'scroll-wrap',
            'scrollBarContainerClass': 'scrollBarContainer',
            //'scrollBarContainerSpecialClass': 'animate',
            'scrollBarClass': 'scroll-bar',
            'keepFocus': true
        });
        //two.resetValues();
            //swal("Saved Message", message.body, "success");
       // }
    });

    $scope.userstyping = [];
    $scope
    socket.on("useristyping", function(name){
        //console.log(name + " is typing");
        if($scope.userstyping.indexOf(name) === -1){
            $scope.userstyping.push(name);
        }
    });

    socket.on("userstoppedtyping", function(name){
        //console.log(name + " stopped typing");
        $scope.userstyping.splice($scope.userstyping.indexOf(name),1);
    });

    function setDate(date) {
        date = new Date(date);
        var dateString;
        if(date.getHours() >= 10) {
            dateString = date.getHours();
        } else {
            dateString = '0' + date.getHours();
        }

        if(date.getMinutes() >= 10) {
            dateString += ':' + date.getMinutes();
        } else {
            dateString += ':0' + date.getMinutes();
        }

        return dateString;
    }

    //NOTIFICATIONS
    $scope.bar = false;
    $scope.changeSlider = function(){
        $scope.bar = !$scope.bar;
        console.log($scope.bar);
        if($scope.bar) {
            Notification.requestPermission();
        }
    };

    function createNotification(message, newNotification){

        $(window).on("blur focus", function(e) {
            var prevType = $(this).data("prevType");

            if (prevType != e.type) {   //  reduce double fire issues
                switch (e.type) {
                    case "blur":
                        console.log(newNotification);
                        if(Notification.permission === "granted") {
                            if($scope.bar && newNotification){
                                var options = {
                                    body: message.body,
                                    icon: 'http://www.clipartbest.com/cliparts/dT7/eGE/dT7eGEonc.png'
                                };
                                var n = new Notification(message.author,options);
                                setTimeout(n.close.bind(n), 4000);
                                newNotification = false;
                            }
                        }
                        break;
                    case "focus":
                        // do work
                        break;
                }
            }

            $(this).data("prevType", e.type);
        })
    }

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