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
exports.TemplateResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const template_entity_1 = require("./entities/template.entity");
const template_service_1 = require("./template.service");
const create_template_input_1 = require("./dto/create-template.input");
const update_template_input_1 = require("./dto/update-template.input");
let TemplateResolver = class TemplateResolver {
    constructor(templateService) {
        this.templateService = templateService;
    }
    async findAll() {
        return this.templateService.findAll();
    }
    async findOne(id) {
        return this.templateService.findOne(id);
    }
    async findByCategory(category) {
        return this.templateService.findByCategory(category);
    }
    async findPublicTemplates() {
        return this.templateService.findPublicTemplates();
    }
    async findByTags(tags) {
        return this.templateService.findByTags(tags);
    }
    async createPromptTemplate(createTemplateInput) {
        return this.templateService.create(createTemplateInput);
    }
    async updatePromptTemplate(updateTemplateInput) {
        return this.templateService.update(updateTemplateInput.id, updateTemplateInput);
    }
    async removePromptTemplate(id) {
        return this.templateService.remove(id);
    }
};
exports.TemplateResolver = TemplateResolver;
__decorate([
    (0, graphql_1.Query)(() => [template_entity_1.PromptTemplate], { name: 'promptTemplates' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TemplateResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => template_entity_1.PromptTemplate, { name: 'promptTemplate' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplateResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => [template_entity_1.PromptTemplate], { name: 'promptTemplatesByCategory' }),
    __param(0, (0, graphql_1.Args)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplateResolver.prototype, "findByCategory", null);
__decorate([
    (0, graphql_1.Query)(() => [template_entity_1.PromptTemplate], { name: 'publicPromptTemplates' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TemplateResolver.prototype, "findPublicTemplates", null);
__decorate([
    (0, graphql_1.Query)(() => [template_entity_1.PromptTemplate], { name: 'promptTemplatesByTags' }),
    __param(0, (0, graphql_1.Args)('tags', { type: () => [String] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TemplateResolver.prototype, "findByTags", null);
__decorate([
    (0, graphql_1.Mutation)(() => template_entity_1.PromptTemplate),
    __param(0, (0, graphql_1.Args)('createTemplateInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_template_input_1.CreateTemplateInput]),
    __metadata("design:returntype", Promise)
], TemplateResolver.prototype, "createPromptTemplate", null);
__decorate([
    (0, graphql_1.Mutation)(() => template_entity_1.PromptTemplate),
    __param(0, (0, graphql_1.Args)('updateTemplateInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_template_input_1.UpdateTemplateInput]),
    __metadata("design:returntype", Promise)
], TemplateResolver.prototype, "updatePromptTemplate", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplateResolver.prototype, "removePromptTemplate", null);
exports.TemplateResolver = TemplateResolver = __decorate([
    (0, graphql_1.Resolver)(() => template_entity_1.PromptTemplate),
    __metadata("design:paramtypes", [template_service_1.TemplateService])
], TemplateResolver);
//# sourceMappingURL=template.resolver.js.map