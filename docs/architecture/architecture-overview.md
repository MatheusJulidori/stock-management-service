# **Architecture Overview — stock-management-service**

## **Purpose**

The system provides product and inventory management with strong guarantees of consistency, scalability, and observability.
Although the domain is simple, the architectural challenges reflect real-world backend systems.

This document describes the high-level architecture, service boundaries, and core patterns used across the system.

---

## **System Context**

```mermaid
flowchart TB

Client[Client / API Consumer]
API[API Service (NestJS)]
Redis[(Redis Cache)]
PGP[(Postgres Primary)]
PGR[(Postgres Replica)]
Kafka[(Kafka Broker)]
Rabbit[(RabbitMQ Broker)]
OTEL[OTEL Collector]
Prometheus[(Prometheus)]
Tempo[(Tempo)]
Loki[(Loki)]
Grafana[(Grafana)]

Client --> API

API --> Redis
API --> PGP
API --> PGR

API --> Kafka
API --> Rabbit

API --> OTEL

OTEL --> Prometheus
OTEL --> Tempo
OTEL --> Loki

Prometheus --> Grafana
Tempo --> Grafana
Loki --> Grafana
```

---

## **Core Architectural Principles**

### **1. Strong Consistency for Stock Operations**

Stock reservation must be safe under concurrency.
This is achieved through:

* ACID transactions
* Row-level locking
* Deadlock detection and retry logic

### **2. Event-Driven Integration**

Two messaging systems serve distinct goals:

* **Kafka** → immutable event stream
* **RabbitMQ** → actionable commands/jobs with retries & DLQ

### **3. Read Scalability via Replication**

All non-critical reads are routed to the **read replica**.
Writes are always routed to the **primary**.

Consistency model:

* **Eventual consistency** for regular reads
* **Read-after-write consistency** using fallback mechanisms

### **4. Observability as a First-Class Citizen**

The system is fully instrumented using OpenTelemetry.
Every request, message, and DB operation emits:

* Traces
* Metrics
* Structured logs

### **5. Defensive Engineering**

* Rate limiting + throttling
* Cache invalidation rules
* Resilience patterns for messaging and DB

---

## **High-Level Architecture Overview**

### **API Layer**

* Exposes REST endpoints
* Orchestrates DB operations
* Handles caching, rate limiting, observability
* Publishes events/messages

### **Database Layer**

* Primary handles all writes
* Replica serves reads
* Handles row/table locks, transactions

### **Messaging Layer**

* Kafka used for event sourcing and audit trails
* RabbitMQ used for job queues and background processing
* Trace context propagates through message headers

### **Observability Layer**

* OTEL Collector receives telemetry
* Prometheus scrapes metrics
* Loki stores structured logs
* Tempo stores traces
* Grafana visualizes all telemetry

---

## **Deployment**

Local environment runs via Docker Compose.
Future stages may include:

* Kubernetes
* Helm charts
* Terraform-managed infra

---

## **Non-Goals**

This project intentionally **does not** include:

* Frontend UI
* Business logic beyond inventory
* Multi-tenant or sharded DB architecture
