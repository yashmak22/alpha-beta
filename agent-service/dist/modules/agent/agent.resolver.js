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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const agent_entity_1 = require("./entities/agent.entity");
const agent_service_1 = require("./agent.service");
const create_agent_input_1 = require("./dto/create-agent.input");
const update_agent_input_1 = require("./dto/update-agent.input");
let AgentResolver = class AgentResolver {
    constructor(agentService) {
        this.agentService = agentService;
    }
    async findAll() {
        return this.agentService.findAll();
    }
    async findOne(id) {
        return this.agentService.findOne(id);
    }
    async findByOwnerId(ownerId) {
        return this.agentService.findByOwnerId(ownerId);
    }
    async findPublicAgents() {
        return this.agentService.findPublicAgents();
    }
    async createAgent(createAgentInput) {
        return this.agentService.create(createAgentInput);
    }
    async updateAgent(updateAgentInput) {
        return this.agentService.update(updateAgentInput.id, updateAgentInput);
    }
    async removeAgent(id) {
        return this.agentService.remove(id);
    }
};
exports.AgentResolver = AgentResolver;
__decorate([
    (0, graphql_1.Query)(() => [agent_entity_1.Agent], { name: 'agents' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgentResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => agent_entity_1.Agent, { name: 'agent' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => [agent_entity_1.Agent], { name: 'agentsByOwner' }),
    __param(0, (0, graphql_1.Args)('ownerId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentResolver.prototype, "findByOwnerId", null);
__decorate([
    (0, graphql_1.Query)(() => [agent_entity_1.Agent], { name: 'publicAgents' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgentResolver.prototype, "findPublicAgents", null);
__decorate([
    (0, graphql_1.Mutation)(() => agent_entity_1.Agent),
    __param(0, (0, graphql_1.Args)('createAgentInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_agent_input_1.CreateAgentInput]),
    __metadata("design:returntype", Promise)
], AgentResolver.prototype, "createAgent", null);
__decorate([
    (0, graphql_1.Mutation)(() => agent_entity_1.Agent),
    __param(0, (0, graphql_1.Args)('updateAgentInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_agent_input_1.UpdateAgentInput]),
    __metadata("design:returntype", Promise)
], AgentResolver.prototype, "updateAgent", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentResolver.prototype, "removeAgent", null);
exports.AgentResolver = AgentResolver = __decorate([
    (0, graphql_1.Resolver)(() => agent_entity_1.Agent),
    __metadata("design:paramtypes", [agent_service_1.AgentService])
], AgentResolver);
//# sourceMappingURL=agent.resolver.js.map