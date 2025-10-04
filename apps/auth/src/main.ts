require('module-alias/register');

import { AUTH_PACKAGE_NAME } from '@jobster/grpc';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { init } from '@jobster/nestjs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  await init(app);
  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      url: app.get(ConfigService).getOrThrow('AUTH_GRPC_SERVICE_URL'),
      package: AUTH_PACKAGE_NAME,
      protoPath: join(__dirname, '../../../libs/grpc/src/lib/proto/auth.proto'),
    },
  });
  await app.startAllMicroservices();
}

bootstrap();
