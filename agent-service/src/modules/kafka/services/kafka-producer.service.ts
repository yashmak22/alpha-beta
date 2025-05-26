import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  private producer: Producer;

  constructor(private configService: ConfigService) {
    const kafka = new Kafka({
      clientId: this.configService.get('KAFKA_CLIENT_ID', 'alpha-agent-service'),
      brokers: this.configService.get('KAFKA_BROKERS', 'localhost:9092').split(','),
    });

    this.producer = kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async produce(record: ProducerRecord) {
    return this.producer.send(record);
  }

  async disconnect() {
    await this.producer.disconnect();
  }

  // Utility method to send an agent-related event
  async sendAgentEvent(topic: string, key: string, value: any) {
    return this.produce({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(value),
          headers: {
            source: 'agent-service',
            timestamp: Date.now().toString(),
          },
        },
      ],
    });
  }

  // Specific event methods
  async sendAgentCreatedEvent(agentId: string, agentData: any) {
    return this.sendAgentEvent('agent-events', agentId, {
      type: 'AGENT_CREATED',
      data: agentData,
      timestamp: new Date().toISOString(),
    });
  }

  async sendAgentUpdatedEvent(agentId: string, agentData: any) {
    return this.sendAgentEvent('agent-events', agentId, {
      type: 'AGENT_UPDATED',
      data: agentData,
      timestamp: new Date().toISOString(),
    });
  }

  async sendSessionStartedEvent(sessionId: string, sessionData: any) {
    return this.sendAgentEvent('session-events', sessionId, {
      type: 'SESSION_STARTED',
      data: sessionData,
      timestamp: new Date().toISOString(),
    });
  }

  async sendSessionEndedEvent(sessionId: string, sessionData: any) {
    return this.sendAgentEvent('session-events', sessionId, {
      type: 'SESSION_ENDED',
      data: sessionData,
      timestamp: new Date().toISOString(),
    });
  }
}
