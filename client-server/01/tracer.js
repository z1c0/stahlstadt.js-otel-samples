'use strict';

const opentelemetry = require('@opentelemetry/core');
const { BasicTracerRegistry, SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

module.exports = (serviceName) => {
  const registry = new BasicTracerRegistry();

  const exporter = new JaegerExporter({
    serviceName,
  });

  registry.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Initialize the OpenTelemetry APIs to use the BasicTracerRegistry bindings
  opentelemetry.initGlobalTracerRegistry(registry);

  const tracer = opentelemetry.getTracer(serviceName);

  // I'm just being lazy here, because it want to shutdown the exporter later.
  tracer.exporter = exporter;

  return tracer;
};