'use strict';

const tracer = require('./tracer')('stahlstadt-http-client');
const http = require('http');

function makeRequest() {
  const span = tracer.startSpan('makeRequest');
  span.setAttribute("host", "localhost");
  span.setAttribute("port", 4598); // see what I did there?
  span.setAttribute("path", "/hello");
  span.setAttribute("method", "GET");
  
  const headers = {};
  tracer.getHttpTextFormat().inject(span.context(), 'HttpTraceContext', headers);

  http.get({
    // add headers here
    headers : headers,
    host: 'localhost',
    port: 4589,
    path: '/hello',
  }, (response) => {
    const body = [];
    response.on('data', (chunk) => body.push(chunk));
    response.on('end', () => {

      console.log(body.toString());
      
      span.setAttribute("code", 200);
      span.end();
    });
  });

  tracer.exporter.shutdown();
}

makeRequest();