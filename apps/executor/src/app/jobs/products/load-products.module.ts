import { Module } from '@nestjs/common';
import { LoadProductsConsumer } from './load-products.consumer';
import { PulsarModule } from '@jobster/pulsar';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Packages } from '@jobster/grpc';
import { join } from 'path';
import { JobClientsModule } from '../job-clients.module';

@Module({
  imports: [
    PulsarModule,
    JobClientsModule,
    ClientsModule.registerAsync([
      {
        name: Packages.PRODUCTS,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.getOrThrow('PRODUCTS_GRPC_SERVICE_URL'),
            package: Packages.PRODUCTS,
            protoPath: join(__dirname, '../../libs/grpc/proto/products.proto'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [LoadProductsConsumer],
})
export class LoadProductsModule {}
