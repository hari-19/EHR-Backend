#!/usr/bin/env node

/**
 * Module dependencies.
 */

 import app from './app';
 import debug = require('debug');
//  ('ehr-backend:server');
 import http from 'http';
 import bunyan from 'bunyan';
 import dotenv from 'dotenv';
 import mongoose from 'mongoose';
 import OrbitDb from "./orbitdb/index";

 dotenv.config();

 /**
  * Get port from environment and store in Express.
  */

 const log = bunyan.createLogger({name : 'EHR' })
 const port = normalizePort(process.env.PORT || '9000');
 app.set('port', port);

 /**
  * Create HTTP server.
  */

 const server = http.createServer(app);

 /**
  * Listen on provided port, on all network interfaces.
  */

 server.listen(port);
 server.on('error', onError);
 server.on('listening', onListening);

 /**
  * Normalize a port into a number, string, or false.
  */

 function normalizePort(val: any) {
   const _port = parseInt(val, 10);

   if (isNaN(_port)) {
     // named pipe
     return val;
   }

   if (_port >= 0) {
     // port number
     return _port;
   }

   return false;
 }

 /**
  * Event listener for HTTP server "error" event.
  */

 function onError(error: any) {
   if (error.syscall !== 'listen') {
     throw error;
   }

   const bind = typeof port === 'string'
     ? 'Pipe ' + port
     : 'Port ' + port;

   // handle specific listen errors with friendly messages
   switch (error.code) {
     case 'EACCES':
       log.error(bind + ' requires elevated privileges');
       process.exit(1);
       break;
     case 'EADDRINUSE':
       log.error(bind + ' is already in use');
       process.exit(1);
       break;
     default:
       throw error;
   }
 }

 /**
  * Event listener for HTTP server "listening" event.
  */

 function onListening() {
   const addr = server.address();
   const bind = typeof addr === 'string'
     ? 'pipe ' + addr
     : 'port ' + addr.port;
   debug('Listening on ' + bind);

   /**
    * Connect to database
    */
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.DB_URL).then(() => {
      // log.info("Started Server on port " + port);
      OrbitDb.getInstance().then(()=>{
        log.info("Started Server on port " + port);
      })
    });
 }
