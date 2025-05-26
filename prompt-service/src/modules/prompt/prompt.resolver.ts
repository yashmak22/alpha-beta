import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent, Int } from '@nestjs/graphql';
import { Prompt } from './entities/prompt.entity';
import { PromptVersion } from './entities/prompt-version.entity';
import { PromptService } from './prompt.service';
import { CreatePromptInput } from './dto/create-prompt.input';
import { UpdatePromptInput } from './dto/update-prompt.input';

@Resolver(() => Prompt)
export class PromptResolver {
  constructor(private readonly promptService: PromptService) {}

  @Query(() => [Prompt], { name: 'prompts' })
  async findAll(): Promise<Prompt[]> {
    return this.promptService.findAll();
  }

  @Query(() => Prompt, { name: 'prompt' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Prompt> {
    return this.promptService.findOne(id);
  }

  @Query(() => [Prompt], { name: 'promptsByOwner' })
  async findByOwnerId(@Args('ownerId', { type: () => ID }) ownerId: string): Promise<Prompt[]> {
    return this.promptService.findByOwnerId(ownerId);
  }

  @Query(() => [Prompt], { name: 'publicPrompts' })
  async findPublicPrompts(): Promise<Prompt[]> {
    return this.promptService.findPublicPrompts();
  }

  @Query(() => PromptVersion, { name: 'promptVersion' })
  async getVersion(
    @Args('promptId', { type: () => ID }) promptId: string,
    @Args('version', { type: () => Int }) version: number,
  ): Promise<PromptVersion> {
    return this.promptService.getVersion(promptId, version);
  }

  @Query(() => PromptVersion, { name: 'currentPromptVersion' })
  async getCurrentVersion(@Args('promptId', { type: () => ID }) promptId: string): Promise<PromptVersion> {
    return this.promptService.getCurrentVersion(promptId);
  }

  @Query(() => String, { name: 'promptContent' })
  async getContent(
    @Args('promptId', { type: () => ID }) promptId: string,
    @Args('version', { type: () => Int, nullable: true }) version?: number,
  ): Promise<string> {
    return this.promptService.getContent(promptId, version);
  }

  @Mutation(() => Prompt)
  async createPrompt(@Args('createPromptInput') createPromptInput: CreatePromptInput): Promise<Prompt> {
    return this.promptService.create(createPromptInput);
  }

  @Mutation(() => Prompt)
  async updatePrompt(@Args('updatePromptInput') updatePromptInput: UpdatePromptInput): Promise<Prompt> {
    return this.promptService.update(updatePromptInput.id, updatePromptInput);
  }

  @Mutation(() => Boolean)
  async removePrompt(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.promptService.remove(id);
  }
}
