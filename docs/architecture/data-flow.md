# **Data Flows — stock-management-service**

This document describes the core flows inside the system.

---

## **1. Product CRUD Flow**

```mermaid
sequenceDiagram
Client->>API: POST /products
API->>PGPrimary: INSERT product
API->>Redis: Invalidate relevant cache keys
API->>Kafka: Publish product.created event
API->>Client: 201 Created
```

Key concepts:

* Cache invalidation on writes
* Event publication for downstream consumers
* No business logic in the event publisher

---

## **2. Product Read Flow**

```mermaid
sequenceDiagram
Client->>API: GET /products/:id
API->>Redis: Check cache
alt cache hit
  Redis->>API: return cached product
  API->>Client: Return cached result
else cache miss
  API->>PGReplica: SELECT * FROM products WHERE id = ?
  API->>Redis: Set cache key
  API->>Client: Return fresh data
end
```

Key concepts:

* Cache-aside pattern
* Replica used only for reads
* Potential replica lag documented

---

## **3. Stock Reservation Flow (Critical Path)**

```mermaid
sequenceDiagram
Client->>API: POST /products/:id/reserve
API->>PGPrimary: BEGIN TRANSACTION
API->>PGPrimary: SELECT * FROM products WHERE id = ? FOR UPDATE
PGPrimary-->>API: locked row
API->>PGPrimary: UPDATE products SET stock = stock - 1
API->>PGPrimary: COMMIT
API->>Kafka: Publish stock.reserved
API->>Client: 200 OK
```

Key principles:

* Row lock guarantees consistency
* Deadlock handling (retry)
* Event emitted for audit processing

---

## **4. Messaging Flow — RabbitMQ Worker**

```mermaid
sequenceDiagram
API->>Rabbit: Publish notification job
Rabbit->>Worker: Deliver job
Worker->>Worker: Process job
alt success
    Worker->>Rabbit: ACK
else failure
    Worker->>Rabbit: Retry until limit
    Worker->>DLQ: NACK to DLQ
end
Worker->>OTEL: Emit job metrics/traces
```
