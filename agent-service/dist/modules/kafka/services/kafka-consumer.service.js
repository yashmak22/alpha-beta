"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var KafkaConsumerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConsumerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const kafkajs_1 = require("kafkajs");
let KafkaConsumerService = KafkaConsumerService_1 = class KafkaConsumerService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(KafkaConsumerService_1.name);
        this.eventHandlers = new Map();
        const kafka = new kafkajs_1.Kafka({
            clientId: this.configService.get('KAFKA_CLIENT_ID', 'alpha-agent-service'),
            brokers: this.configService.get('KAFKA_BROKERS', 'localhost:9092').split(','),
        });
        this.consumer = kafka.consumer({
            groupId: this.configService.get('KAFKA_CONSUMER_GROUP', 'agent-service-group'),
        });
    }
    async onModuleInit() {
        await this.consumer.connect();
        await this.consumer.subscribe({
            topics: ['model-events', 'prompt-events', 'memory-events', 'tool-events'],
            fromBeginning: false,
        });
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                this.logger.log(`Received message from topic: ${topic}, partition: ${partition}`);
                try {
                    const messageType = this.getMessageType(message);
                    const handler = this.eventHandlers.get(messageType);
                    if (handler) {
                        await handler(message);
                    }
                    else {
                        this.logger.warn(`No handler registered for message type: ${messageType}`);
                    }
                }
                catch (error) {
                    this.logger.error(`Error processing message: ${error.message}`, error.stack);
                }
            },
        });
    }
    getMessageType(message) {
        try {
            if (message.headers && message.headers['type']) {
                return message.headers['type'].toString();
            }
            const payload = JSON.parse(message.value.toString());
            return payload.type || 'UNKNOWN';
        }
        catch (error) {
            this.logger.error(`Error parsing message type: ${error.message}`);
            return 'UNKNOWN';
        }
    }
    registerEventHandler(eventType, handler) {
        this.eventHandlers.set(eventType, handler);
        this.logger.log(`Registered handler for event type: ${eventType}`);
    }
    async disconnect() {
        await this.consumer.disconnect();
    }
};
exports.KafkaConsumerService = KafkaConsumerService;
exports.KafkaConsumerService = KafkaConsumerService = KafkaConsumerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], KafkaConsumerService);
//# sourceMappingURL=kafka-consumer.service.js.map