"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const prompt_entity_1 = require("./entities/prompt.entity");
const prompt_version_entity_1 = require("./entities/prompt-version.entity");
const prompt_service_1 = require("./prompt.service");
const prompt_resolver_1 = require("./prompt.resolver");
let PromptModule = class PromptModule {
};
exports.PromptModule = PromptModule;
exports.PromptModule = PromptModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([prompt_entity_1.Prompt, prompt_version_entity_1.PromptVersion])],
        providers: [prompt_service_1.PromptService, prompt_resolver_1.PromptResolver],
        exports: [prompt_service_1.PromptService],
    })
], PromptModule);
//# sourceMappingURL=prompt.module.js.map