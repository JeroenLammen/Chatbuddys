exports.database = {
    server: 'serverName',
    port: 0000,
    database: 'databaseName',
    getURL: function(){
        return 'mongodb://' + this.server + ':' + this.port + '/' + this.database;
    }
};

exports.server = {
    port: 3000,
    ip: '0.0.0.0'
};