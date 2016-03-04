exports.database = {
    server: 'servername',
    port: 00000,
    database: 'databasename',
    getURL: function(){
        return 'mongodb://' + this.server + ':' + this.port + '/' + this.database;
    }
};

exports.server = {
    port: 3001,
    ip: '0.0.0.0'
};