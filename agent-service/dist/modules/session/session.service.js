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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const session_entity_1 = require("./entities/session.entity");
const agent_service_1 = require("../agent/agent.service");
let SessionService = class SessionService {
    constructor(sessionRepository, agentService) {
        this.sessionRepository = sessionRepository;
        this.agentService = agentService;
    }
    async findAll() {
        return this.sessionRepository.find({ relations: ['agent'] });
    }
    async findOne(id) {
        const session = await this.sessionRepository.findOne({
            where: { id },
            relations: ['agent']
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${id} not found`);
        }
        return session;
    }
    async create(createSessionInput) {
        await this.agentService.findOne(createSessionInput.agentId);
        const session = this.sessionRepository.create(Object.assign(Object.assign({}, createSessionInput), { isActive: true }));
        return this.sessionRepository.save(session);
    }
    async update(id, updateSessionInput) {
        const session = await this.findOne(id);
        const updatedSession = this.sessionRepository.merge(session, updateSessionInput);
        return this.sessionRepository.save(updatedSession);
    }
    async remove(id) {
        const session = await this.findOne(id);
        const result = await this.sessionRepository.remove(session);
        return !!result;
    }
    async findByAgentId(agentId) {
        return this.sessionRepository.find({
            where: { agentId },
            relations: ['agent']
        });
    }
    async findByUserId(userId) {
        return this.sessionRepository.find({
            where: { userId },
            relations: ['agent']
        });
    }
    async findActiveSessions() {
        return this.sessionRepository.find({
            where: { isActive: true },
            relations: ['agent']
        });
    }
    async endSession(id) {
        const session = await this.findOne(id);
        session.isActive = false;
        session.endedAt = new Date();
        return this.sessionRepository.save(session);
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        agent_service_1.AgentService])
], SessionService);
//# sourceMappingURL=session.service.js.map