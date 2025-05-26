import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaProducerService } from './services/kafka-producer.service';
import { KafkaConsumerService } from './services/kafka-consumer.service';

@Module({
  imports: [ConfigModule],
  providers: [
    KafkaProducerService,
    KafkaConsumerService,
  ],
  exports: [
    KafkaProducerService,
    KafkaConsumerService,
  ],
})
export class KafkaModule {}
