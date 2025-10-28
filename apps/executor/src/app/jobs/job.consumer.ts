import {
  AcknowledgeRequest,
  JOBS_SERVICE_NAME,
  JobsServiceClient,
} from '@jobster/grpc';
import { PulsarClient, PulsarConsumer } from '@jobster/pulsar';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export abstract class JobConsumer<
  T extends AcknowledgeRequest
> extends PulsarConsumer<T> {
  private jobsService: JobsServiceClient;

  constructor(
    topic: string,
    pulsarClient: PulsarClient,
    private readonly grpcClient: ClientGrpc
  ) {
    super(pulsarClient, topic);
  }

  async onModuleInit(): Promise<void> {
    this.jobsService =
      this.grpcClient.getService<JobsServiceClient>(JOBS_SERVICE_NAME);

    await super.onModuleInit();
  }

  protected async onMessage(data: T): Promise<void> {
    try {
      await this.execute(data);
      await firstValueFrom(this.jobsService.acknowledge(data));
    } catch (err: any) {
      console.error('[JobConsumer] Failed to process job', {
        data,
        code: err?.code,
        message: err?.message,
        details: err?.details,
        stack: err?.stack,
      });
      throw err;
    }
  }

  protected abstract execute(data: T): Promise<void>;
}
