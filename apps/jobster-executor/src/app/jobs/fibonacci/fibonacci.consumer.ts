import { Injectable } from '@nestjs/common';
import { PulsarClient, PulsarConsumer } from '@jobster/pulsar';
import { Message } from 'pulsar-client';

@Injectable()
export class FibonacciConsumer extends PulsarConsumer {
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, 'Fibonacci');
  }

  protected async onMessage(message: Message): Promise<void> {
    console.log('FibonacciConsumer.onMessage');
    await this.acknowledge(message);
  }
}
