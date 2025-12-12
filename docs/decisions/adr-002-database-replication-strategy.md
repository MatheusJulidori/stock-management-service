# **ADR-002: Postgres Primary + Read Replica Strategy**

## **Status**

Accepted

## **Context**

The project needs:

* Strong consistency for writes (product creation, stock updates)
* Scalable reads
* Ability to demonstrate replica lag
* Read-after-write mitigation

## **Decision**

Use a **primary instance for writes** and **one read replica** for queries.

## **Rationale**

* Mirrors real-world architectures
* Simplifies consistency model
* Makes replica lag explicit
* Enables fallback mechanisms for critical reads

## **Consequences**

Positive:

* Better read throughput
* Clear separation of concerns
* Demonstrates real distributed consistency issues

Negative:

* Replica lag may impact user experience
* Operational complexity is higher
