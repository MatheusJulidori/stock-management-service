# **ADR-003: Using Kafka and RabbitMQ in the Same Project**

## **Status**

Accepted

## **Context**

Kafka and RabbitMQ serve different purposes, and the project aims to train both paradigms.

## **Decision**

Use:

* **Kafka** for event streaming
* **RabbitMQ** for job/work queues

## **Rationale**

Kafka:

* Immutable log
* High throughput
* Event-driven architectures
* Excellent for auditing and replay

RabbitMQ:

* Flexible routing
* Supports retries, DLQ, nack
* Ideal for tasks (notifications, processing)

## **Consequences**

Positive:

* Learn two major messaging models
* Clear separation of event vs command patterns

Negative:

* Operational overhead
* Developer must understand two styles of messaging
