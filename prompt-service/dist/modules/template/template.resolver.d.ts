import { PromptTemplate } from './entities/template.entity';
import { TemplateService } from './template.service';
import { CreateTemplateInput } from './dto/create-template.input';
import { UpdateTemplateInput } from './dto/update-template.input';
export declare class TemplateResolver {
    private readonly templateService;
    constructor(templateService: TemplateService);
    findAll(): Promise<PromptTemplate[]>;
    findOne(id: string): Promise<PromptTemplate>;
    findByCategory(category: string): Promise<PromptTemplate[]>;
    findPublicTemplates(): Promise<PromptTemplate[]>;
    findByTags(tags: string[]): Promise<PromptTemplate[]>;
    createPromptTemplate(createTemplateInput: CreateTemplateInput): Promise<PromptTemplate>;
    updatePromptTemplate(updateTemplateInput: UpdateTemplateInput): Promise<PromptTemplate>;
    removePromptTemplate(id: string): Promise<boolean>;
}
