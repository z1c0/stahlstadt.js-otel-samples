'use strict';

const tracer = require('./tracer')('stahlstadt-http-client');
const http = require('http');

function makeRequest() {
  const span = tracer.startSpan('makeRequest');
  
  // This is new. Set context for the HTTP library
  tracer.withSpan(span, () => {
    http.get({
      host: 'localhost',
      port: 4589,
      path: '/hello',
    }, (response) => {
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
        console.log(body.toString());
        span.end();
      });
    });
  });
  
  tracer.exporter.shutdown();
}

makeRequest();