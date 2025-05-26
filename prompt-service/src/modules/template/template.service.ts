import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromptTemplate } from './entities/template.entity';
import { CreateTemplateInput } from './dto/create-template.input';
import { UpdateTemplateInput } from './dto/update-template.input';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(PromptTemplate)
    private templateRepository: Repository<PromptTemplate>,
  ) {}

  async findAll(): Promise<PromptTemplate[]> {
    return this.templateRepository.find();
  }

  async findOne(id: string): Promise<PromptTemplate> {
    const template = await this.templateRepository.findOne({ where: { id } });
    
    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    
    return template;
  }

  async create(createTemplateInput: CreateTemplateInput): Promise<PromptTemplate> {
    const template = this.templateRepository.create(createTemplateInput);
    return this.templateRepository.save(template);
  }

  async update(id: string, updateTemplateInput: UpdateTemplateInput): Promise<PromptTemplate> {
    const template = await this.findOne(id);
    const updatedTemplate = this.templateRepository.merge(template, updateTemplateInput);
    return this.templateRepository.save(updatedTemplate);
  }

  async remove(id: string): Promise<boolean> {
    const template = await this.findOne(id);
    const result = await this.templateRepository.remove(template);
    return !!result;
  }

  async findByCategory(category: string): Promise<PromptTemplate[]> {
    return this.templateRepository.find({ where: { category } });
  }

  async findPublicTemplates(): Promise<PromptTemplate[]> {
    return this.templateRepository.find({ where: { isPublic: true } });
  }

  async findByTags(tags: string[]): Promise<PromptTemplate[]> {
    // Find templates that match any of the provided tags
    return this.templateRepository.createQueryBuilder('template')
      .where('template.tags && :tags', { tags })
      .getMany();
  }
}
