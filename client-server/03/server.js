'use strict';

const tracer = require('./tracer')('stahlstadt-http-server');
const http = require('http');

/** Starts a HTTP server that receives requests on sample server port. */
function startServer(port) {
  // Creates a server
  const server = http.createServer(handleRequest);
  // Starts the server
  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Node HTTP listening on ${port}`);
  });
}

/** A function which handles requests and send response. */
function handleRequest(request, response) {
  console.log("handling request");

  // We "magically" have a current span.
  const currentSpan = tracer.getCurrentSpan();
  
  const span = tracer.startSpan('handleRequest', { parent: currentSpan });
  
  try {
    const body = [];
    request.on('error', (err) => console.log(err));
    request.on('data', (chunk) => body.push(chunk));
    request.on('end', () => {
      // deliberately sleeping to mock some action.
      setTimeout(() => {
        span.end();
        response.end('Hello Stahlstadt.js!');
      }, 1000);
    });
  } catch (err) {
    console.error(err);
    span.end();
  }
}


startServer(4589);