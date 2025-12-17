/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { envConfig } from './config/env.config';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: envConfig.NODE_ENV === 'production' ? 'info' : 'debug',
        genReqId: (req, res) => {
          const header = req.headers['x-request-id'];

          const requestId =
            (Array.isArray(header) ? header[0] : header)?.trim() ||
            randomUUID();

          res.setHeader('x-request-id', requestId);
          return requestId;
        },
        customLogLevel: (req, res, err) => {
          if (err) return 'error';
          if (res.statusCode >= 500) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
        redact: [
          'req.headers',
          'req.raw.headers',
          'req.cookies',
          'req.headers.authorization',
          'req.headers.cookie',
          'res.headers',
        ],
        mixin: () => ({
          service: 'stock-management-service',
          env: envConfig.NODE_ENV,
        }),
      },
    }),
    HealthModule,
  ],
})
export class AppModule {}
