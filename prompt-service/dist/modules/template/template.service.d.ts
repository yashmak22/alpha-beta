import { Repository } from 'typeorm';
import { PromptTemplate } from './entities/template.entity';
import { CreateTemplateInput } from './dto/create-template.input';
import { UpdateTemplateInput } from './dto/update-template.input';
export declare class TemplateService {
    private templateRepository;
    constructor(templateRepository: Repository<PromptTemplate>);
    findAll(): Promise<PromptTemplate[]>;
    findOne(id: string): Promise<PromptTemplate>;
    create(createTemplateInput: CreateTemplateInput): Promise<PromptTemplate>;
    update(id: string, updateTemplateInput: UpdateTemplateInput): Promise<PromptTemplate>;
    remove(id: string): Promise<boolean>;
    findByCategory(category: string): Promise<PromptTemplate[]>;
    findPublicTemplates(): Promise<PromptTemplate[]>;
    findByTags(tags: string[]): Promise<PromptTemplate[]>;
}
