# **Component Breakdown — stock-management-service**

## **API Service**

Responsibilities:

* Request routing
* Data validation
* Cache access
* DB routing (read/write)
* Messaging publish
* Observability instrumentation
* Rate limiting and throttling

Constraints:

* Must remain stateless
* Must not contain long-running jobs

---

## **Postgres Primary**

Responsibilities:

* Writes
* Transactions
* Row/table locking
* ACID consistency

---

## **Postgres Replica**

Responsibilities:

* All read operations
* Offload reads from the primary

Constraints:

* Eventual consistency
* Replica lag acceptable within defined tolerances

---

## **Redis**

Responsibilities:

* Read cache
* Rate limiting backend
* Short-lived locking (optional)

Non-goals:

* Never used as source of truth

---

## **Kafka**

Responsibilities:

* Event streaming
* Durable event history
* Replay capability

---

## **RabbitMQ**

Responsibilities:

* Command/job processing
* Retries
* DLQ

Complementary to Kafka, not competing.

---

## **OTEL Collector**

Responsibilities:

* Single ingestion point for logs, traces, and metrics
* Export pipelines to:

  * Prometheus (metrics)
  * Tempo (traces)
  * Loki (logs)

---

## **Grafana**

Responsibilities:

* Dashboards
* Querying logs, metrics, and traces
