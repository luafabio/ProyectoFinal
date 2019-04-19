const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');

const server = restify.createServer();

//Middleware
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

server.listen(config.PORT, () => {
    mongoose.connect(
        config.MONGODB_URI, 
        { useNewUrlParser: true }
    );
});

const db = mongoose.connection;

db.on('error', (err) => console.log(err));

db.once('open', () => {
    require('./routes/stops')(server);
    require('./routes/buses')(server);
    require('./routes/bings')(server);
    console.log(`Server started on port ${config.PORT}`);
});