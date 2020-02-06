'use strict';

const opentelemetry = require('@opentelemetry/core');
const { BasicTracerRegistry, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/tracing');

// Create tracer registry
const registry = new BasicTracerRegistry();
// Add an SpanProcessor and an Exporter.
registry.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
// Initialize the OpenTelemetry APIs to use the BasicTracerRegistry bindings
opentelemetry.initGlobalTracerRegistry(registry);

//
// From here it's the same as in "02-server-add-tracing"
//

const tracer = opentelemetry.getTracer('server');

function main(nrOfJobs) {
  // Create the main span
  const mainSpan = tracer.startSpan('main');
  mainSpan.setAttribute("nr-of-jobs", nrOfJobs);

  console.log("main starts") 
  
  for (let i = 0; i < nrOfJobs; i += 1) {
    doWork(i, mainSpan);
  }

  console.log("main ends")

  mainSpan.end();
}

function doWork(nr, parentSpan) {
  const childSpan = tracer.startSpan("doWork", { parent: parentSpan })
  childSpan.setAttribute("worker-nr", nr);

  for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
    // empty
  }
  console.log("job #" + nr);

  childSpan.end();
}


// start our app
main(10);