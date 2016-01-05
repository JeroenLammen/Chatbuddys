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
        if(enableNotifications){
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