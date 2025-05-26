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
exports.PromptVersion = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const prompt_entity_1 = require("./prompt.entity");
let PromptVersion = class PromptVersion {
};
exports.PromptVersion = PromptVersion;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PromptVersion.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PromptVersion.prototype, "version", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], PromptVersion.prototype, "content", void 0);
__decorate([
    (0, graphql_1.Field)(() => prompt_entity_1.Prompt),
    (0, typeorm_1.ManyToOne)(() => prompt_entity_1.Prompt, prompt => prompt.versions),
    (0, typeorm_1.JoinColumn)({ name: 'promptId' }),
    __metadata("design:type", prompt_entity_1.Prompt)
], PromptVersion.prototype, "prompt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], PromptVersion.prototype, "promptId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PromptVersion.prototype, "createdById", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PromptVersion.prototype, "createdAt", void 0);
exports.PromptVersion = PromptVersion = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('prompt_versions')
], PromptVersion);
//# sourceMappingURL=prompt-version.entity.js.map