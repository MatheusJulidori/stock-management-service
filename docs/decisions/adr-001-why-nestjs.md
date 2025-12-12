# **ADR-001: Choosing NestJS for the API Layer**

## **Status**

Accepted

## **Context**

The project requires:

* A structured, scalable backend framework
* First-class support for dependency injection
* Clear modularization patterns
* Excellent developer experience
* Strong TypeScript ecosystem
* Easy integration with OpenTelemetry, Kafka, RabbitMQ, Redis, Postgres

## **Decision**

Use **NestJS** as the main API framework.

## **Rationale**

* Highly opinionated → enforces architecture discipline
* DI container simplifies testing and modular design
* Strong community and integrations
* Native TypeScript → reduces boilerplate
* Easy to scaffold features quickly while focusing on backend engineering patterns
* Works well for both monolith-style services and distributed systems

## **Consequences**

Positive:

* Faster onboarding
* More maintainable codebase
* Cleaner service boundaries

Negative:

* Slight performance overhead vs Fastify/Express
* Developer must understand Nest’s abstractions
