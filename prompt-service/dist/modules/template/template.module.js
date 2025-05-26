"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const template_entity_1 = require("./entities/template.entity");
const template_service_1 = require("./template.service");
const template_resolver_1 = require("./template.resolver");
let TemplateModule = class TemplateModule {
};
exports.TemplateModule = TemplateModule;
exports.TemplateModule = TemplateModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([template_entity_1.PromptTemplate])],
        providers: [template_service_1.TemplateService, template_resolver_1.TemplateResolver],
        exports: [template_service_1.TemplateService],
    })
], TemplateModule);
//# sourceMappingURL=template.module.js.map