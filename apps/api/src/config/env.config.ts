import { envSchema } from './env.schema';
import { env } from 'process';

const result = envSchema.safeParse(env);

if (!result.success) {
  console.error('❌ Environment validation failed:');
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    const location = path ? `[${path}]` : '';
    console.error(`  ${location} ${issue.message}`);
  });
  process.exit(1);
}

/**
 * Validated environment configuration.
 *
 * @important This object is frozen and immutable after initialization.
 * Any attempt to mutate it will fail silently in strict mode or throw in development.
 */
export const envConfig = Object.freeze(result.data);
