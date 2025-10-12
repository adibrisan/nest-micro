import { FibonacciMessage, PulsarClient } from '@jobster/pulsar';
import { Job } from '../../decorators/job.decorator';
import { AbstractJob } from '../abstract.job';
import { Jobs } from '@jobster/nestjs';

@Job({
  name: Jobs.FIBONACCI,
  description: 'Generate a Fibonacci sequence and store it in db.',
})
export class FibonacciJob extends AbstractJob<FibonacciMessage> {
  protected messageClass = FibonacciMessage;

  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }
}
