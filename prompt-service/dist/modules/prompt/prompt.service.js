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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const prompt_entity_1 = require("./entities/prompt.entity");
const prompt_version_entity_1 = require("./entities/prompt-version.entity");
let PromptService = class PromptService {
    constructor(promptRepository, promptVersionRepository) {
        this.promptRepository = promptRepository;
        this.promptVersionRepository = promptVersionRepository;
    }
    async findAll() {
        return this.promptRepository.find();
    }
    async findOne(id) {
        const prompt = await this.promptRepository.findOne({
            where: { id },
            relations: ['versions']
        });
        if (!prompt) {
            throw new common_1.NotFoundException(`Prompt with ID ${id} not found`);
        }
        return prompt;
    }
    async create(createPromptInput) {
        const { content } = createPromptInput, promptData = __rest(createPromptInput, ["content"]);
        const prompt = this.promptRepository.create(Object.assign(Object.assign({}, promptData), { currentVersion: 1 }));
        const savedPrompt = await this.promptRepository.save(prompt);
        const version = this.promptVersionRepository.create({
            version: 1,
            content,
            promptId: savedPrompt.id,
            createdById: createPromptInput.ownerId,
        });
        await this.promptVersionRepository.save(version);
        return this.findOne(savedPrompt.id);
    }
    async update(id, updatePromptInput) {
        const prompt = await this.findOne(id);
        const { content } = updatePromptInput, promptData = __rest(updatePromptInput, ["content"]);
        if (Object.keys(promptData).length > 1) {
            const updatedPrompt = this.promptRepository.merge(prompt, promptData);
            await this.promptRepository.save(updatedPrompt);
        }
        if (content) {
            const newVersion = prompt.currentVersion + 1;
            const version = this.promptVersionRepository.create({
                version: newVersion,
                content,
                promptId: prompt.id,
                createdById: updatePromptInput.ownerId,
            });
            await this.promptVersionRepository.save(version);
            await this.promptRepository.update(id, { currentVersion: newVersion });
        }
        return this.findOne(id);
    }
    async remove(id) {
        const prompt = await this.findOne(id);
        await this.promptVersionRepository.delete({ promptId: id });
        const result = await this.promptRepository.remove(prompt);
        return !!result;
    }
    async findByOwnerId(ownerId) {
        return this.promptRepository.find({
            where: { ownerId },
            relations: ['versions'],
        });
    }
    async findPublicPrompts() {
        return this.promptRepository.find({
            where: { isPublic: true },
            relations: ['versions'],
        });
    }
    async getVersion(promptId, version) {
        const promptVersion = await this.promptVersionRepository.findOne({
            where: { promptId, version },
        });
        if (!promptVersion) {
            throw new common_1.NotFoundException(`Version ${version} not found for prompt ${promptId}`);
        }
        return promptVersion;
    }
    async getCurrentVersion(promptId) {
        const prompt = await this.findOne(promptId);
        return this.getVersion(promptId, prompt.currentVersion);
    }
    async getContent(promptId, version) {
        let promptVersion;
        if (version) {
            promptVersion = await this.getVersion(promptId, version);
        }
        else {
            promptVersion = await this.getCurrentVersion(promptId);
        }
        return promptVersion.content;
    }
};
exports.PromptService = PromptService;
exports.PromptService = PromptService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(prompt_entity_1.Prompt)),
    __param(1, (0, typeorm_1.InjectRepository)(prompt_version_entity_1.PromptVersion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PromptService);
//# sourceMappingURL=prompt.service.js.map