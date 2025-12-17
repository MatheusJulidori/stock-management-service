import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { envConfig } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: envConfig.NODE_ENV === 'production' ? 'info' : 'debug',
        mixin: () => ({
          service: 'stock-management-service',
          env: envConfig.NODE_ENV,
        }),
      },
    }),
  ],
})
export class AppModule {}
