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
exports.SessionResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const session_entity_1 = require("./entities/session.entity");
const agent_entity_1 = require("../agent/entities/agent.entity");
const session_service_1 = require("./session.service");
const agent_service_1 = require("../agent/agent.service");
const create_session_input_1 = require("./dto/create-session.input");
const update_session_input_1 = require("./dto/update-session.input");
let SessionResolver = class SessionResolver {
    constructor(sessionService, agentService) {
        this.sessionService = sessionService;
        this.agentService = agentService;
    }
    async findAll() {
        return this.sessionService.findAll();
    }
    async findOne(id) {
        return this.sessionService.findOne(id);
    }
    async findByAgentId(agentId) {
        return this.sessionService.findByAgentId(agentId);
    }
    async findByUserId(userId) {
        return this.sessionService.findByUserId(userId);
    }
    async findActiveSessions() {
        return this.sessionService.findActiveSessions();
    }
    async createSession(createSessionInput) {
        return this.sessionService.create(createSessionInput);
    }
    async updateSession(updateSessionInput) {
        return this.sessionService.update(updateSessionInput.id, updateSessionInput);
    }
    async removeSession(id) {
        return this.sessionService.remove(id);
    }
    async endSession(id) {
        return this.sessionService.endSession(id);
    }
    async agent(session) {
        if (session.agent) {
            return session.agent;
        }
        return this.agentService.findOne(session.agentId);
    }
};
exports.SessionResolver = SessionResolver;
__decorate([
    (0, graphql_1.Query)(() => [session_entity_1.Session], { name: 'sessions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => session_entity_1.Session, { name: 'session' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => [session_entity_1.Session], { name: 'sessionsByAgent' }),
    __param(0, (0, graphql_1.Args)('agentId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "findByAgentId", null);
__decorate([
    (0, graphql_1.Query)(() => [session_entity_1.Session], { name: 'sessionsByUser' }),
    __param(0, (0, graphql_1.Args)('userId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "findByUserId", null);
__decorate([
    (0, graphql_1.Query)(() => [session_entity_1.Session], { name: 'activeSessions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "findActiveSessions", null);
__decorate([
    (0, graphql_1.Mutation)(() => session_entity_1.Session),
    __param(0, (0, graphql_1.Args)('createSessionInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_session_input_1.CreateSessionInput]),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "createSession", null);
__decorate([
    (0, graphql_1.Mutation)(() => session_entity_1.Session),
    __param(0, (0, graphql_1.Args)('updateSessionInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_session_input_1.UpdateSessionInput]),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "updateSession", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "removeSession", null);
__decorate([
    (0, graphql_1.Mutation)(() => session_entity_1.Session),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "endSession", null);
__decorate([
    (0, graphql_1.ResolveField)(() => agent_entity_1.Agent),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_entity_1.Session]),
    __metadata("design:returntype", Promise)
], SessionResolver.prototype, "agent", null);
exports.SessionResolver = SessionResolver = __decorate([
    (0, graphql_1.Resolver)(() => session_entity_1.Session),
    __metadata("design:paramtypes", [session_service_1.SessionService,
        agent_service_1.AgentService])
], SessionResolver);
//# sourceMappingURL=session.resolver.js.map