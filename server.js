var http = require('http')
var express = require('./config/express')
var app = express()

var db = require('./config/database')
db('mongodb://localhost/quakeLogParser')

http.createServer(app).listen(
    app.get('port'),
    app.get('ip'),
    function() {
        console.log('Server running on ' + app.get('ip') + ':' + app.get('port'))
        app.core.parseLog.readLog()
    }
)