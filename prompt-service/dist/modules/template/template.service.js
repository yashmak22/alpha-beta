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
exports.TemplateService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const template_entity_1 = require("./entities/template.entity");
let TemplateService = class TemplateService {
    constructor(templateRepository) {
        this.templateRepository = templateRepository;
    }
    async findAll() {
        return this.templateRepository.find();
    }
    async findOne(id) {
        const template = await this.templateRepository.findOne({ where: { id } });
        if (!template) {
            throw new common_1.NotFoundException(`Template with ID ${id} not found`);
        }
        return template;
    }
    async create(createTemplateInput) {
        const template = this.templateRepository.create(createTemplateInput);
        return this.templateRepository.save(template);
    }
    async update(id, updateTemplateInput) {
        const template = await this.findOne(id);
        const updatedTemplate = this.templateRepository.merge(template, updateTemplateInput);
        return this.templateRepository.save(updatedTemplate);
    }
    async remove(id) {
        const template = await this.findOne(id);
        const result = await this.templateRepository.remove(template);
        return !!result;
    }
    async findByCategory(category) {
        return this.templateRepository.find({ where: { category } });
    }
    async findPublicTemplates() {
        return this.templateRepository.find({ where: { isPublic: true } });
    }
    async findByTags(tags) {
        return this.templateRepository.createQueryBuilder('template')
            .where('template.tags && :tags', { tags })
            .getMany();
    }
};
exports.TemplateService = TemplateService;
exports.TemplateService = TemplateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(template_entity_1.PromptTemplate)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TemplateService);
//# sourceMappingURL=template.service.js.map