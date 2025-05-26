import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PromptTemplate } from './entities/template.entity';
import { TemplateService } from './template.service';
import { CreateTemplateInput } from './dto/create-template.input';
import { UpdateTemplateInput } from './dto/update-template.input';

@Resolver(() => PromptTemplate)
export class TemplateResolver {
  constructor(private readonly templateService: TemplateService) {}

  @Query(() => [PromptTemplate], { name: 'promptTemplates' })
  async findAll(): Promise<PromptTemplate[]> {
    return this.templateService.findAll();
  }

  @Query(() => PromptTemplate, { name: 'promptTemplate' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<PromptTemplate> {
    return this.templateService.findOne(id);
  }

  @Query(() => [PromptTemplate], { name: 'promptTemplatesByCategory' })
  async findByCategory(@Args('category') category: string): Promise<PromptTemplate[]> {
    return this.templateService.findByCategory(category);
  }

  @Query(() => [PromptTemplate], { name: 'publicPromptTemplates' })
  async findPublicTemplates(): Promise<PromptTemplate[]> {
    return this.templateService.findPublicTemplates();
  }

  @Query(() => [PromptTemplate], { name: 'promptTemplatesByTags' })
  async findByTags(@Args('tags', { type: () => [String] }) tags: string[]): Promise<PromptTemplate[]> {
    return this.templateService.findByTags(tags);
  }

  @Mutation(() => PromptTemplate)
  async createPromptTemplate(
    @Args('createTemplateInput') createTemplateInput: CreateTemplateInput,
  ): Promise<PromptTemplate> {
    return this.templateService.create(createTemplateInput);
  }

  @Mutation(() => PromptTemplate)
  async updatePromptTemplate(
    @Args('updateTemplateInput') updateTemplateInput: UpdateTemplateInput,
  ): Promise<PromptTemplate> {
    return this.templateService.update(updateTemplateInput.id, updateTemplateInput);
  }

  @Mutation(() => Boolean)
  async removePromptTemplate(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.templateService.remove(id);
  }
}
