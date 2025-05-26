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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaProducerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const kafkajs_1 = require("kafkajs");
let KafkaProducerService = class KafkaProducerService {
    constructor(configService) {
        this.configService = configService;
        const kafka = new kafkajs_1.Kafka({
            clientId: this.configService.get('KAFKA_CLIENT_ID', 'alpha-agent-service'),
            brokers: this.configService.get('KAFKA_BROKERS', 'localhost:9092').split(','),
        });
        this.producer = kafka.producer();
    }
    async onModuleInit() {
        await this.producer.connect();
    }
    async produce(record) {
        return this.producer.send(record);
    }
    async disconnect() {
        await this.producer.disconnect();
    }
    async sendAgentEvent(topic, key, value) {
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
    async sendAgentCreatedEvent(agentId, agentData) {
        return this.sendAgentEvent('agent-events', agentId, {
            type: 'AGENT_CREATED',
            data: agentData,
            timestamp: new Date().toISOString(),
        });
    }
    async sendAgentUpdatedEvent(agentId, agentData) {
        return this.sendAgentEvent('agent-events', agentId, {
            type: 'AGENT_UPDATED',
            data: agentData,
            timestamp: new Date().toISOString(),
        });
    }
    async sendSessionStartedEvent(sessionId, sessionData) {
        return this.sendAgentEvent('session-events', sessionId, {
            type: 'SESSION_STARTED',
            data: sessionData,
            timestamp: new Date().toISOString(),
        });
    }
    async sendSessionEndedEvent(sessionId, sessionData) {
        return this.sendAgentEvent('session-events', sessionId, {
            type: 'SESSION_ENDED',
            data: sessionData,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.KafkaProducerService = KafkaProducerService;
exports.KafkaProducerService = KafkaProducerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], KafkaProducerService);
//# sourceMappingURL=kafka-producer.service.js.map