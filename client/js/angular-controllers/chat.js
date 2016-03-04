chatApp.controller("chatController", function($scope, $http, socket, $cookies, $location, $sce) {

//--------------------------------------------------------------------------------------------
//  USERS
// -------------------------------------------------------------------------------------------

    //CHECK IF USERNAME AND ID ARE SET, OTHERWISE REDIRECT TO LOGIN PAGE
    $cookies.get("username") && $cookies.get("ID")
        ? $scope.username = $cookies.get("username")
        : $location.path('/login');

    //SEND USER TO SERVER
    if($cookies.get("ID") && $scope.username) {
        socket.emit("newUser", {username: $scope.username, id: $cookies.get("ID")});
    }

    //ACTIVE USERS
    $scope.usersOnline = [];

    //GET ALL CURRENT USERS
    socket.on("userList", function(userlist) {
       $scope.usersOnline = userlist;
    });

    //GET NEW USER
    socket.on("newUser", function(newUser){
       $scope.usersOnline.push(newUser);
    });

    //REMOVE DISCONNECTED USER
    socket.on("disconnectedUser", function(userObj){
        var index = getIndexOfObject($scope.usersOnline, "socketID", userObj.socketID);
        $scope.usersOnline.splice(index, 1);
        //REMOVE FROM LIVE TYPING ARRAY
        var index2 = getIndexOfObject($scope.usersTyping, "socketID", userObj.socketID);
        if(index2 > -1) {
            $scope.usersTyping.splice(index, 1);
        }
    });

//--------------------------------------------------------------------------------------------
//  MESSAGES
// -------------------------------------------------------------------------------------------

    //ALL MESSAGES
    $scope.messages = [];

    //EXPERIMENTAL, RENDER HTML TAGS IN MESSAGE
    $scope.trustAsHtml = $sce.trustAsHtml;

    $('#messageField').emojiarea({button: '#openEmoji'});

    //GET ALL MESSAGES
    $http.get("/chat")
        .success(function(messages){
            setTimeout(function(){
                $('#messageWindow').mCustomScrollbar('scrollTo','bottom', {
                    scrollInertia:0
                });
            },1);
            for(var i =0; i<messages.length; i++){
                messages[i].date = setDate(messages[i].date);
                if(messages[i].authorID === $cookies.get("ID")){
                    messages[i].from = "self";
                } else {
                    messages[i].from = "other";
                }
                $scope.messages.push(messages[i]);
            }
        })
        .error(function(err){
            swal("error", err, "error");
        });

    //MESSAGE INPUT EVENTS
    $scope.update = function($event) {
        setTimeout( function() {

            if($event.keyCode === 13) {
                $scope.sendMessage();
            }
            if($scope.message){
                $scope.removePlaceholder();
                socket.emit("typing", $scope.username);
            } else {
                $scope.addPlaceholder();
                socket.emit("stoppedTyping", $scope.username);
            }
        }, 1);
    };

    //LOGOUT
    $scope.logout = function() {
        var cookies = $cookies.getAll();

        angular.forEach(cookies, function (v, k) {
            $cookies.remove(k);
        });

        location.reload();
    };

    //USERS WHO ARE CURRENTLY TYPING A MESSAGE
    $scope.usersTyping = [];

    //LIVE TYPING LISTENER
    socket.on("userIsTyping", function(userObj){
        var index = getIndexOfObject($scope.usersTyping, "socketID", userObj.socketID);
        if(index === -1) {
            $scope.usersTyping.push(userObj);
        }
    });

    //STOPPED TYPING LISTENER
    socket.on("userStoppedTyping", function(userObj){
        var index = getIndexOfObject($scope.usersTyping, "socketID", userObj.socketID);
        if(index > -1) {
            $scope.usersTyping.splice(index, 1);
        }
    });

    //REMOVE DIV PLACEHOLDER
    $scope.removePlaceholder = function() {
        $("#div-placeholder").empty();
    };

    //ADD DIV PLACEHOLDER
    $scope.addPlaceholder = function() {
        $("#div-placeholder").text("Write a message...");
    };

    $scope.selectedFile = null;

    //SEND MESSAGE
    $scope.sendMessage = function(){
        $scope.newMessage = {
            body: $scope.message,
            file: $scope.selectedFile
        };
        $scope.message = '';
        $("#messageField").empty();
        //$("#textbar").children("#messageField").empty();
        $scope.selectedFile = null;
        $("#textbar").children("#messageField").focus();
        socket.emit("sendMessage", $scope.newMessage);
    };

    //SENT MESSAGE IS INCORRECT
    socket.on("incorrectMessage", function(err){
        //swal("error", err, "error");
    });

    //GET NEW MESSAGE
    socket.on("message", function(message){
        message.date = setDate(message.date);
        if(message.authorID === $cookies.get("ID")){
            message.from = "self";
        } else {
            message.from = "other";
        }
        $scope.messages.unshift(message);
        setTimeout(function() {
            $('#messageWindow').mCustomScrollbar('scrollTo', 'bottom', {
                scrollInertia: 0
            });
        },0);

        if(!tabActive) {
            changeTitle(message, tabActive);
            createNotification(message, $scope.enableNotifications);
        }
    });


    //FILE UPLOAD
    $scope.openFile = function() {
        $("#target").click();
    };


    $scope.upload = function(){
        var selectedFile = $('#target').get(0).files[0];

        var fd = new FormData();
        fd.append('file', selectedFile);
        fd.append("id", $cookies.get("ID"));

        $http.post("/uploads", fd, {
            transformRequest: angular.identity,
            headers: {"Content-Type": undefined}
        })
            .success(function(data){
            })
            .error(function(error){
            });
    };

    $scope.preventEnter = function($event) {
        if($event.keyCode === 13) {
            $event.preventDefault();
        }
    };

    var tabActive = true;

    $(window).on("blur focus", function(e) {
        var prevType = $(this).data("prevType");
        if (prevType != e.type) {   //  reduce double fire issues
            switch (e.type) {
                case "blur":
                    tabActive = false;
                    break;
                case "focus":
                    tabActive = true;
                    removeTitle();
                    break;
            }
        }
        $(this).data("prevType", e.type);
    });

    //REQUEST, ENABLE AND DISABLE NOTIFICATIONS
    if(Notification.permission === "granted") {
        if($cookies.get("notifications") === "true") {
            $scope.enableNotifications = true;
        } else {
            $scope.enableNotifications = false;
        }
    } else {
        $cookies.put("notifications", "false");
        $scope.enableNotifications = false;
    }

    $scope.changeSlider = function(){
        if(Notification.permission !== "granted") {
            Notification.requestPermission(function(permission) {
               if(permission === "granted") {
                   $cookies.put("notifications", "true");
                   $scope.enableNotifications = true;
                   //UGLY FIX FOR SLIDER NOT CHANGING POSITION THE FIRST TIME
                   $("#sliderPosition").click();
                   $("#sliderPosition").click();
               } else {
                   $cookies.put("notifications", "false");
                   $scope.enableNotifications = false;
                   swal({
                           title: "Oops...",
                           text: "You have blocked us from showing notifications. <br> Please enable notifications in the site settings if you want to use this feature",
                           type: "info",
                           html: true
                       });
               }
            });
        } else {
            if($scope.enableNotifications) {
                $cookies.put("notifications", "false");
            } else {
                $cookies.put("notifications", "true");
            }
            $scope.enableNotifications = !$scope.enableNotifications;
        }
    };

//--------------------------------------------------------------------------------------------
//  WEBRTC
//--------------------------------------------------------------------------------------------
    //NOT IMPLEMENTED

    //navigator.getUserMedia = navigator.getUserMedia ||
    //    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    //
    //function successCallback(localMediaStream) {
    //    window.stream = localMediaStream; // stream available to console
    //    console.log("successcallback");
    //    if ($('video').length === 0) {
    //        $("#messageWindow").append("<video></video>");
    //        var video = document.querySelector("video");
    //        video.src = window.URL.createObjectURL(localMediaStream);
    //        video.play();
    //    } else {
    //        var removevideo = document.querySelector("video");
    //        //window.stream.stop();
    //        removevideo.src = null;
    //        removevideo.remove();
    //    }
    //}
    //
    //function errorCallback(error){
    //    console.log("navigator.getUserMedia error: ", error);
    //}
    //
    //var constraints = {
    //    video: false,
    //    audio: false
    //};
    //
    //$scope.requestCamera = function() {
    //    constraints.video = true;
    //    navigator.getUserMedia(constraints, successCallback, errorCallback);
    //};
    //
    //$scope.fa_icon = 'fa fa-microphone fa-2x';
    //
    //$scope.requestMicrophone = function() {
    //    if(!constraints.audio){
    //        constraints.audio = true;
    //        navigator.getUserMedia(constraints, successCallback, errorCallback);
    //        $scope.fa_icon = 'fa fa-microphone-slash fa-2x';
    //    } else {
    //        constraints.audio = false;
    //        $scope.fa_icon = 'fa fa-microphone fa-2x';
    //        if(constraints.video){
    //            navigator.getUserMedia(constraints, successCallback, errorCallback);
    //        } else {
    //            $("video").remove();
    //        }
    //    }
    //
    //
    //};

});