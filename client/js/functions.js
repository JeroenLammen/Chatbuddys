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
    if(Notification.permission === "granted") {
        console.log("granted");
        if(enableNotifications){
            console.log("enabled");
            var options = {
                body: message.body,
                icon: 'http://www.clipartbest.com/cliparts/dT7/eGE/dT7eGEonc.png'
            };
            var n = new Notification(message.author,options);
            setTimeout(n.close.bind(n), 4000);
        }
    }
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
    console.log(files);
    swal({
        title: 'Upload?',
        text: files[0].name,
        type: 'info',
        animation: 'slide-from-top',
        showCancelButton: true,
        closeOnConfirm: true
    }, function(){
        angular.element('ng-view').scope().upload();
        //angular.element('ng-view').scope().sendMessage();
        //swal("ok!", "pfftst", "success");
    }, function(){
        //$('#target').val = null;
        //console.log("canceled!");
    });
}