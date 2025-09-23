import { Module } from '@nestjs/common';
import { FibonacciConsumer } from './fibonacci/fibonacci.consumer';
import { PulsarModule } from '@jobster/pulsar';

@Module({
  imports: [PulsarModule],
  providers: [FibonacciConsumer],
})
export class JobsModule {}
