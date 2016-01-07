exports.database = {
    server: 'server5.tezzt.nl',
    port: 27017,
    database: 'S4DHangouts',
    getURL: function(){
        return 'mongodb://' + this.server + ':' + this.port + '/' + this.database;
    }
};

exports.server = {
    port: 3001,
    ip: '0.0.0.0'
};