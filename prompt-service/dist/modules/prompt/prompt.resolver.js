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
exports.PromptResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const prompt_entity_1 = require("./entities/prompt.entity");
const prompt_version_entity_1 = require("./entities/prompt-version.entity");
const prompt_service_1 = require("./prompt.service");
const create_prompt_input_1 = require("./dto/create-prompt.input");
const update_prompt_input_1 = require("./dto/update-prompt.input");
let PromptResolver = class PromptResolver {
    constructor(promptService) {
        this.promptService = promptService;
    }
    async findAll() {
        return this.promptService.findAll();
    }
    async findOne(id) {
        return this.promptService.findOne(id);
    }
    async findByOwnerId(ownerId) {
        return this.promptService.findByOwnerId(ownerId);
    }
    async findPublicPrompts() {
        return this.promptService.findPublicPrompts();
    }
    async getVersion(promptId, version) {
        return this.promptService.getVersion(promptId, version);
    }
    async getCurrentVersion(promptId) {
        return this.promptService.getCurrentVersion(promptId);
    }
    async getContent(promptId, version) {
        return this.promptService.getContent(promptId, version);
    }
    async createPrompt(createPromptInput) {
        return this.promptService.create(createPromptInput);
    }
    async updatePrompt(updatePromptInput) {
        return this.promptService.update(updatePromptInput.id, updatePromptInput);
    }
    async removePrompt(id) {
        return this.promptService.remove(id);
    }
};
exports.PromptResolver = PromptResolver;
__decorate([
    (0, graphql_1.Query)(() => [prompt_entity_1.Prompt], { name: 'prompts' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromptResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => prompt_entity_1.Prompt, { name: 'prompt' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromptResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => [prompt_entity_1.Prompt], { name: 'promptsByOwner' }),
    __param(0, (0, graphql_1.Args)('ownerId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromptResolver.prototype, "findByOwnerId", null);
__decorate([
    (0, graphql_1.Query)(() => [prompt_entity_1.Prompt], { name: 'publicPrompts' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromptResolver.prototype, "findPublicPrompts", null);
__decorate([
    (0, graphql_1.Query)(() => prompt_version_entity_1.PromptVersion, { name: 'promptVersion' }),
    __param(0, (0, graphql_1.Args)('promptId', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('version', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], PromptResolver.prototype, "getVersion", null);
__decorate([
    (0, graphql_1.Query)(() => prompt_version_entity_1.PromptVersion, { name: 'currentPromptVersion' }),
    __param(0, (0, graphql_1.Args)('promptId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromptResolver.prototype, "getCurrentVersion", null);
__decorate([
    (0, graphql_1.Query)(() => String, { name: 'promptContent' }),
    __param(0, (0, graphql_1.Args)('promptId', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('version', { type: () => graphql_1.Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], PromptResolver.prototype, "getContent", null);
__decorate([
    (0, graphql_1.Mutation)(() => prompt_entity_1.Prompt),
    __param(0, (0, graphql_1.Args)('createPromptInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_prompt_input_1.CreatePromptInput]),
    __metadata("design:returntype", Promise)
], PromptResolver.prototype, "createPrompt", null);
__decorate([
    (0, graphql_1.Mutation)(() => prompt_entity_1.Prompt),
    __param(0, (0, graphql_1.Args)('updatePromptInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_prompt_input_1.UpdatePromptInput]),
    __metadata("design:returntype", Promise)
], PromptResolver.prototype, "updatePrompt", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromptResolver.prototype, "removePrompt", null);
exports.PromptResolver = PromptResolver = __decorate([
    (0, graphql_1.Resolver)(() => prompt_entity_1.Prompt),
    __metadata("design:paramtypes", [prompt_service_1.PromptService])
], PromptResolver);
//# sourceMappingURL=prompt.resolver.js.map