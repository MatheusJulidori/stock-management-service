# **ADR-005: Caching Strategy Using Redis**

## **Status**

Accepted

## **Context**

Product reads must be fast and scalable.
Replica reads are slower than Redis.
Invalidation must be precise and deterministic.

## **Decision**

Use Redis with a **cache-aside** strategy.

## **Rationale**

* Simple and widely adopted
* Cache invalidation handled explicitly
* No risk of stale writes since source of truth is Postgres
* Fits well with API read patterns

## **Consequences**

Positive:

* Reduced read load
* Faster API responses
* Easy to monitor hit/miss ratio

Negative:

* Requires explicit invalidation logic
* Risk of cache stampede (future mitigation planned)
