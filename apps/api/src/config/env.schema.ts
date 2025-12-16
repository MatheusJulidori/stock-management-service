import { z } from 'zod';

/**
 * Kafka broker configuration structure.
 *
 * @important Architecture Rule: After env validation, this structure is final.
 * No string parsing should occur elsewhere in the codebase.
 * Kafka clients should consume this structure directly or be mapped once
 * in a config adapter.
 */

export type KafkaBroker = {
  host: string;
  port: number;
};

export const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535),
  NODE_ENV: z
    .string()
    .trim()
    .refine((val) => ['development', 'production', 'test'].includes(val), {
      message: 'NODE_ENV must be one of: development, production, test',
    }),
  DATABASE_URL_PRIMARY: z.url(),
  DATABASE_URL_REPLICA: z.url(),
  REDIS_URL: z.url(),
  /**
   * Kafka broker configuration.
   *
   * Input: Comma-separated string of "host:port" pairs
   * Example: "kafka1:9092,kafka2:9092"
   *
   * Output: Array of validated broker objects
   *
   * @important This is the final structure. No string parsing should
   * occur after env validation. Use this structure directly in Kafka clients
   * or map it once in a config adapter.
   */
  KAFKA_BROKERS: z
    .string() // Is a string
    .trim() // Remove whitespace from the start and end of the string
    .min(1) // The string must be at least 1 character long
    .transform(
      (
        val, // Transform the string
      ) =>
        val // The string to transform
          .split(',') // Split the string into an array of strings
          .map((s) => s.trim()) // Remove whitespace from the start and end of each string
          .filter((s) => s.length > 0), // Filter out any empty strings
    )
    .refine((brokers) => brokers.length > 0, {
      message: 'At least one Kafka broker is required',
    })
    .superRefine((brokers, ctx) => {
      // Check if the brokers are in the correct format
      const seen = new Set<string>();
      brokers.forEach((broker, index) => {
        if (seen.has(broker)) {
          ctx.addIssue({
            code: 'custom',
            path: [index],
            message: `Duplicate broker found: ${broker}`,
          });
          return;
        }
        seen.add(broker);

        const parts = broker.split(':'); // Split the broker into an array of strings

        if (parts.length !== 2) {
          ctx.addIssue({
            code: 'custom',
            path: [index], // This tells Zod which array element failed
            message: `Broker must be in format 'host:port', got: ${broker}`,
          });
          return;
        }

        const [host, portStr] = parts;

        // Validate host
        if (!host || host.trim().length === 0) {
          ctx.addIssue({
            code: 'custom',
            path: [index],
            message: `Broker host cannot be empty: ${broker}`,
          });
        }

        // Validate port
        const port = parseInt(portStr, 10); // Convert the port string to an integer

        if (isNaN(port)) {
          ctx.addIssue({
            code: 'custom',
            path: [index],
            message: `Port must be a number, got: ${portStr}`,
          });
          return;
        }

        if (!Number.isInteger(port)) {
          ctx.addIssue({
            code: 'custom',
            path: [index],
            message: `Port must be an integer, got: ${portStr}`,
          });
          return;
        }

        if (port < 1 || port > 65535) {
          ctx.addIssue({
            code: 'custom',
            path: [index],
            message: `Port must be between 1 and 65535, got: ${port}`,
          });
        }
      });
    })
    .transform((brokers): KafkaBroker[] =>
      brokers.map((broker) => {
        const [host, portStr] = broker.split(':');
        return {
          host: host.trim(),
          port: parseInt(portStr, 10),
        };
      }),
    ),
  RABBITMQ_URL: z.url(),
  OTEL_COLLECTOR_ENDPOINT: z.url(),
  // PROMETHEUS_URL: z.url(),
  //GRAFANA_URL: z.url(),
  //TEMPO_URL: z.url(),
  //LOKI_URL: z.url(),
  // CACHE_TTL_SECONDS: z.coerce.number(),
  // RATE_LIMIT_WINDOW_SECONDS: z.coerce.number(),
  // RATE_LIMIT_POINTS: z.coerce.number(),
  // JWT_SECRET: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;
