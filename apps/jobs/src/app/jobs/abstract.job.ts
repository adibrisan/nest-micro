import { PulsarClient, serialize } from '@jobster/pulsar';
import { Producer } from 'pulsar-client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export abstract class AbstractJob<T extends object> {
  private producer: Producer;
  protected abstract messageClass: new () => T;

  constructor(private readonly pulsarClient: PulsarClient) {}

  async execute(data: T, job: string) {
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(job);
    }
    if (Array.isArray(data)) {
      for (const message of data) {
        this.send(message);
      }
      return;
    }
    this.send(data);
  }

  private send(data: T) {
    this.validateData(data)
      .then(() =>
        this.producer.send({
          data: serialize(data),
        })
      )
      .catch((err) => {
        console.error('Send failed', err);
      });
  }

  private async validateData(data: T) {
    if (Array.isArray(data)) {
      for (const item of data) {
        const errors = await validate(plainToInstance(this.messageClass, item));
        if (errors.length) {
          throw new BadRequestException(
            `Job data is invalid ${JSON.stringify(errors)}`
          );
        }
      }
    } else {
      const errors = await validate(plainToInstance(this.messageClass, data));
      if (errors.length) {
        throw new BadRequestException(
          `Job data is invalid ${JSON.stringify(errors)}`
        );
      }
    }
  }
}
