import { Inject, Injectable } from '@nestjs/common';
import { FibonacciMessage, PulsarClient } from '@jobster/pulsar';
import { Jobs } from '@jobster/nestjs';
import { iterate } from 'fibonacci';
import { JobConsumer } from '../job.consumer';
import { Packages } from '@jobster/grpc';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class FibonacciConsumer extends JobConsumer<FibonacciMessage> {
  constructor(
    @Inject(Packages.JOBS) clientJobs: ClientGrpc,
    pulsarClient: PulsarClient
  ) {
    super(Jobs.FIBONACCI, pulsarClient, clientJobs);
  }

  protected async execute(data: FibonacciMessage): Promise<void> {
    const result = iterate(data.iterations);
    this.logger.log(result);
  }
}
