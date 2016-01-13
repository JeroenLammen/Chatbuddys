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
                //messages[i].body = $sce.trustAsHtml(messages[i].body);
                //messages[i].body = messages[i].body.linkify();
                messages[i].date = setDate(messages[i].date);
                if(messages[i].authorID === $cookies.get("ID")){
                    messages[i].from = "self";
                } else {
                    messages[i].from = "other";
                }
                $scope.messages.push(messages[i]);
                //emojify.run();
            }
        })
        .error(function(err){
            swal("error", err, "error");
        });

    //MESSAGE INPUT EVENTS
    $scope.update = function($event) {
        setTimeout( function() {
            console.log($scope.message);

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

    $scope.removePlaceholder = function() {
        $("#div-placeholder").empty();
    };

    $scope.addPlaceholder = function() {
        $("#div-placeholder").text("Write a message...");
    };

    $scope.selectedFile = null;

    //SEND MESSAGE
    $scope.sendMessage = function(){
        console.log($scope.selectedFile);
        $scope.newMessage = {
            body: $scope.message,
            file: $scope.selectedFile
        };
        $scope.message = '';
        $("#messageField").empty();
        //$("#textbar").children("#messageField").empty();
        $scope.selectedFile = null;
        console.log("EMPTIED");
        console.log($scope.selectedFile);
        $("#textbar").children("#messageField").focus();
        socket.emit("sendMessage", $scope.newMessage);
    };

    //SENT MESSAGE IS INCORRECT
    socket.on("incorrectMessage", function(err){
        //swal("error", err, "error");
    });

    //GET NEW MESSAGE
    socket.on("message", function(message){

        //TRYING TO FIX SCROLLBAR WHEN MESSAGEWINDOW IS ENLARGED
        //$("#messageWindow").removeAttr("data-slimscroll");
        //$(".scroll-wrap > #allMessages").unwrap();
        //$(".scrollBarContainer").remove();

        //message.body = message.body.linkify();
        //message.body = $sce.trustAsHtml(message.body);
        message.date = setDate(message.date);
        console.log("authorID: " + message.authorID);
        console.log("socketID: " + socket.id());
        if(message.authorID === $cookies.get("ID")){
            message.from = "self";
        } else {
            message.from = "other";
        }
        $scope.messages.unshift(message);

        //messageSlimScroll.resetValues();
        setTimeout(function() {
            console.log('aasasas');
            $('#messageWindow').mCustomScrollbar('scrollTo', 'bottom', {
                scrollInertia: 0
            });
        },0);

        if(!tabActive) {
            changeTitle(message, tabActive);
            createNotification(message, $scope.enableNotifications);
        }

        //var element = document.querySelectorAll('.slimScroll');
        //var two = new slimScroll(element[1], {
        //    'wrapperClass': 'scroll-wrap',
        //    'scrollBarContainerClass': 'scrollBarContainer',
        //    //'scrollBarContainerSpecialClass': 'animate',
        //    'scrollBarClass': 'scroll-bar',
        //    'keepFocus': true
        //});
        //two.resetValues();
            //swal("Saved Message", message.body, "success");
       // }
    });

    var selectedFile = document.getElementById('target').files[0];
    console.log(selectedFile);

    //FILE UPLOAD
    $scope.openFile = function() {
        $("#target").click();
    };


    $scope.upload = function(){
        var selectedFile = $('#target').get(0).files[0];
        console.log(selectedFile);

        var fd = new FormData();
        fd.append('file', selectedFile);
        fd.append("id", $cookies.get("ID"));

        console.log("uploading....");
        $http.post("/uploads", fd, {
            transformRequest: angular.identity,
            headers: {"Content-Type": undefined}
        })
            .success(function(data){
                console.log(data);
            })
            .error(function(error){
                console.log("error!");
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
                    //console.log("tab is no longer active");
                    break;
                case "focus":
                    tabActive = true;
                    removeTitle();
                   // console.log("tab is active again!");
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
                console.log("requesting....");
               if(permission === "granted") {
                   console.log("granted");
                   $cookies.put("notifications", "true");
                   //TODO: fix slider not changing, even though the code above is being executed
                   $scope.enableNotifications = true;
                   //UGLY FIX FOR PROBLEM ABOVE
                   $("#sliderPosition").click();
                   $("#sliderPosition").click();
               } else {
                   console.log("denied");
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

    var messageSlimScroll;

    //SCROLLBAR
    //window.onload = function(){
    //    if(!navigator.userAgent.match('Macintosh')){
    //        var element = document.querySelectorAll('.slimScroll');
    //        // Apply slim scroll plugin
    //        messageSlimScroll = new slimScroll(element[1], {
    //            'wrapperClass': 'scroll-wrap',
    //            'scrollBarContainerClass': 'scrollBarContainer',
    //            //'scrollBarContainerSpecialClass': 'animate',
    //            'scrollBarClass': 'scroll-bar',
    //            'keepFocus': true
    //        });
    //
    //        // resize example
    //        // To make the resizing work, set the height of the container in PERCENTAGE
    //        window.onresize = function(){
    //            one.resetValues();
    //        }
    //    } else {
    //        document.write("For Mac users, this custom slimscroll styles will not be applied");
    //    }
    //};

    //slimscroll won't load without a timeout
    //setTimeout(function(){
    //    window.onload();
    //},100);

//--------------------------------------------------------------------------------------------
//  WEBRTC
//--------------------------------------------------------------------------------------------

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
            var removevideo = document.querySelector("video");
            //window.stream.stop();
            removevideo.src = null;
            removevideo.remove();
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

    //TODO: include and configure FlowType.js, CSS font styles need to be redone
    //$('body').flowtype({
    //    minFont : 12,
    //    maxFont : 40
    //});

});