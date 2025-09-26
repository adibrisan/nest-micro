import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import * as pinoPretty from 'pino-pretty';
import { Writable } from 'stream';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        let stream: Writable | undefined;

        if (!isProduction) {
          stream = pinoPretty({ singleLine: true }) as unknown as Writable;
        }

        return {
          pinoHttp: {
            level: isProduction ? 'info' : 'debug',
            stream,
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
