import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaMessage } from 'kafkajs';
export declare class KafkaConsumerService implements OnModuleInit {
    private configService;
    private consumer;
    private readonly logger;
    private eventHandlers;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private getMessageType;
    registerEventHandler(eventType: string, handler: (message: KafkaMessage) => Promise<void>): void;
    disconnect(): Promise<void>;
}
