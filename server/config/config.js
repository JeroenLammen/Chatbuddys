exports.database = {
    server: 'server',
    port: 0000,
    database: 'database',
    getURL: function(){
        return 'mongodb://' + this.server + ':' + this.port + '/' + this.database;
    }
};

exports.server = {
    port: 3000,
    ip: '0.0.0.0'
};