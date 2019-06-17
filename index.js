const restify = require('restify');
const mongoose = require('mongoose');
const cluster = require('cluster');
const config = require('./config');
const corsMiddleware = require('restify-cors-middleware');
const Schedule = require('./schedule');

const server = restify.createServer();

const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['Access-Control-Allow-Origin'],
    exposeHeaders: []
});

//Middleware
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

server.pre(cors.preflight);
server.use(cors.actual);


if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    this.worker = cluster.fork();


    server.listen(config.PORT, () => {
        mongoose.connect(
            config.MONGODB_URI,
            {useNewUrlParser: true, useCreateIndex: true}
        );
    });
    console.log(`Server started at port: ${config.PORT}`);

    const db = mongoose.connection;

    db.on('error', (err) => console.log(err));

    db.once('open', () => {
        require('./routes/stops')(server);
        require('./routes/buses')(server);
        require('./routes/bings')(server);
    });

} else {
    console.log(`Worker ${process.pid} is running`);

    mongoose.connect(
        config.MONGODB_URI,
        {useNewUrlParser: true, useCreateIndex: true}
    );

    const db = mongoose.connection;

    db.on('error', (err) => console.log(err));

    db.once('open', () => {
        // this.ci = setInterval(async () => {
        let schedule = new Schedule();
        schedule.getStops()
    }, 60 * 1000)

}

