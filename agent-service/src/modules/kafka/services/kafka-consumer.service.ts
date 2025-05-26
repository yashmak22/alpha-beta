import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, KafkaMessage } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private consumer: Consumer;
  private readonly logger = new Logger(KafkaConsumerService.name);
  private eventHandlers: Map<string, (message: KafkaMessage) => Promise<void>> = new Map();

  constructor(private configService: ConfigService) {
    const kafka = new Kafka({
      clientId: this.configService.get('KAFKA_CLIENT_ID', 'alpha-agent-service'),
      brokers: this.configService.get('KAFKA_BROKERS', 'localhost:9092').split(','),
    });

    this.consumer = kafka.consumer({
      groupId: this.configService.get('KAFKA_CONSUMER_GROUP', 'agent-service-group'),
    });
  }

  async onModuleInit() {
    await this.consumer.connect();
    
    // Subscribe to relevant topics
    await this.consumer.subscribe({
      topics: ['model-events', 'prompt-events', 'memory-events', 'tool-events'],
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        this.logger.log(`Received message from topic: ${topic}, partition: ${partition}`);
        
        try {
          // Get message type from header or payload
          const messageType = this.getMessageType(message);
          
          // Find handler for this message type
          const handler = this.eventHandlers.get(messageType);
          
          if (handler) {
            await handler(message);
          } else {
            this.logger.warn(`No handler registered for message type: ${messageType}`);
          }
        } catch (error) {
          this.logger.error(`Error processing message: ${error.message}`, error.stack);
        }
      },
    });
  }

  private getMessageType(message: KafkaMessage): string {
    try {
      if (message.headers && message.headers['type']) {
        return message.headers['type'].toString();
      }
      
      // If not in headers, try to get from message value
      const payload = JSON.parse(message.value.toString());
      return payload.type || 'UNKNOWN';
    } catch (error) {
      this.logger.error(`Error parsing message type: ${error.message}`);
      return 'UNKNOWN';
    }
  }

  // Register event handlers
  registerEventHandler(eventType: string, handler: (message: KafkaMessage) => Promise<void>) {
    this.eventHandlers.set(eventType, handler);
    this.logger.log(`Registered handler for event type: ${eventType}`);
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}
