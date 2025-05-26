import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProducerRecord } from 'kafkajs';
export declare class KafkaProducerService implements OnModuleInit {
    private configService;
    private producer;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    produce(record: ProducerRecord): Promise<import("kafkajs").RecordMetadata[]>;
    disconnect(): Promise<void>;
    sendAgentEvent(topic: string, key: string, value: any): Promise<import("kafkajs").RecordMetadata[]>;
    sendAgentCreatedEvent(agentId: string, agentData: any): Promise<import("kafkajs").RecordMetadata[]>;
    sendAgentUpdatedEvent(agentId: string, agentData: any): Promise<import("kafkajs").RecordMetadata[]>;
    sendSessionStartedEvent(sessionId: string, sessionData: any): Promise<import("kafkajs").RecordMetadata[]>;
    sendSessionEndedEvent(sessionId: string, sessionData: any): Promise<import("kafkajs").RecordMetadata[]>;
}
