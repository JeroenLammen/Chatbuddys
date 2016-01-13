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

function createNotification(message, enableNotifications){
    //images are not supported in the notification body, so remove them
    message.body = removeEmojis(message.body);
    if(Notification.permission === "granted") {
        if(enableNotifications){
            var options = {
                body: message.body,
                icon: '../images/cb-icon2.png'
            };
            var n = new Notification(message.author,options);
            setTimeout(n.close.bind(n), 4000);
        }
    }
}

function removeEmojis(body) {
    body = body.replace(/<img[^>]*>/g,"");
    return body;
}

var titleTimeout;
function changeTitle(message, tabActive) {
    document.title = message.author + ' zegt: '+message.body + "...";
    titleTimeout = setTimeout(function() {
        document.title = "Chatbuddy's";
        if (!tabActive) {
            document.title = "Chatbuddy's | new message(s)" ;
        }
    },5000);   
}

function removeTitle() {
    clearTimeout(titleTimeout);
    document.title = "Chatbuddy's";
}

function getIndexOfObject(array, property, value) {
    for(var i = 0; i < array.length; i++) {
        if (array[i][property] === value) {
            return i;
        }
    }
    return -1;
}

function confirmupload(files) {
    swal({
        title: 'Upload?',
        text: files[0].name,
        type: 'info',
        animation: 'slide-from-top',
        showCancelButton: true,
        closeOnConfirm: true
    }, function(){
        angular.element('ng-view').scope().upload();
    }, function(){
        //$('#target').val = null;
        //console.log("canceled!");
    });
}