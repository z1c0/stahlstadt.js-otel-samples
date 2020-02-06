'use strict';

const opentelemetry = require('@opentelemetry/core');
const { BasicTracerRegistry, SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const registry = new BasicTracerRegistry();

//
// Add the Jaeger exporter
//
const spanProcessor = new SimpleSpanProcessor(new JaegerExporter({ serviceName: "stahlstadt-demo" }));
registry.addSpanProcessor(spanProcessor);
opentelemetry.initGlobalTracerRegistry(registry);


const tracer = opentelemetry.getTracer('server');


function main(nrOfJobs) {
  const mainSpan = tracer.startSpan('main');
  mainSpan.setAttribute("nr-of-jobs", nrOfJobs);

  console.log("main starts") 
  
  for (let i = 0; i < nrOfJobs; i += 1) {
    doWork(i, mainSpan);
  }

  console.log("main ends")

  mainSpan.end();

  // flush and close the connection.
  spanProcessor.shutdown();
}

function doWork(nr, parentSpan) {
  const childSpan = tracer.startSpan('doWork', {
    parent: parentSpan,
  });
  childSpan.setAttribute("worker-nr", nr);

  for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
    // empty
  }
  console.log("job #" + nr);

  childSpan.end();
}


// start our app
main(10);