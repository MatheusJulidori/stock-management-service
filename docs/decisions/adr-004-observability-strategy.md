# **ADR-004: Full Observability Using OpenTelemetry**

## **Status**

Accepted

## **Context**

The project aims to practice production-grade observability.

## **Decision**

Use:

* OpenTelemetry SDKs for traces, metrics, and logs
* OTEL Collector as ingestion and routing layer
* Prometheus, Tempo, and Loki as backends
* Grafana for visualization

## **Rationale**

* Vendor-neutral
* Modern standard for distributed tracing
* Clear and extensible pipeline
* Integrates metrics, logs, traces in one toolchain

## **Consequences**

Positive:

* High-quality debugging
* End-to-end correlation
* Production-grade setup

Negative:

* Configuration complexity
* Requires learning OTEL Collector pipelines
