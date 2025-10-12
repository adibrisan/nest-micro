import { Injectable } from '@nestjs/common';
import {
  FibonacciMessage,
  PulsarClient,
  PulsarConsumer,
} from '@jobster/pulsar';
import { Jobs } from '@jobster/nestjs';
import { iterate } from 'fibonacci';

@Injectable()
export class FibonacciConsumer extends PulsarConsumer<FibonacciMessage> {
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, Jobs.FIBONACCI);
  }

  protected async onMessage(data: FibonacciMessage): Promise<void> {
    const result = iterate(data.iterations);
    this.logger.log(result);
  }
}
