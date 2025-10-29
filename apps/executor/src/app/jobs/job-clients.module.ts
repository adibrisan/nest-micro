import { Packages } from '@jobster/grpc';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: Packages.JOBS,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.getOrThrow('JOBS_GRPC_SERVICE_URL'),
            package: Packages.JOBS,
            protoPath: join(__dirname, '../../libs/grpc/proto/jobs.proto'),
            loader: { keepCase: true },
            channelOptions: {
              'grpc.max_reconnect_backoff_ms': 1000,
              'grpc.min_reconnect_backoff_ms': 500,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class JobClientsModule {}
