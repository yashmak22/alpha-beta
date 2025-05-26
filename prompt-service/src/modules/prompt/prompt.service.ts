import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prompt } from './entities/prompt.entity';
import { PromptVersion } from './entities/prompt-version.entity';
import { CreatePromptInput } from './dto/create-prompt.input';
import { UpdatePromptInput } from './dto/update-prompt.input';

@Injectable()
export class PromptService {
  constructor(
    @InjectRepository(Prompt)
    private promptRepository: Repository<Prompt>,
    @InjectRepository(PromptVersion)
    private promptVersionRepository: Repository<PromptVersion>,
  ) {}

  async findAll(): Promise<Prompt[]> {
    return this.promptRepository.find();
  }

  async findOne(id: string): Promise<Prompt> {
    const prompt = await this.promptRepository.findOne({ 
      where: { id },
      relations: ['versions']
    });
    
    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found`);
    }
    
    return prompt;
  }

  async create(createPromptInput: CreatePromptInput): Promise<Prompt> {
    // Extract content from input
    const { content, ...promptData } = createPromptInput;
    
    // Create the prompt
    const prompt = this.promptRepository.create({
      ...promptData,
      currentVersion: 1,
    });
    
    // Save the prompt to get an ID
    const savedPrompt = await this.promptRepository.save(prompt);
    
    // Create the initial version
    const version = this.promptVersionRepository.create({
      version: 1,
      content,
      promptId: savedPrompt.id,
      createdById: createPromptInput.ownerId,
    });
    
    // Save the version
    await this.promptVersionRepository.save(version);
    
    // Return the prompt with versions
    return this.findOne(savedPrompt.id);
  }

  async update(id: string, updatePromptInput: UpdatePromptInput): Promise<Prompt> {
    const prompt = await this.findOne(id);
    
    // Extract content from input if provided
    const { content, ...promptData } = updatePromptInput;
    
    // Update prompt metadata
    if (Object.keys(promptData).length > 1) { // More than just the ID
      const updatedPrompt = this.promptRepository.merge(prompt, promptData);
      await this.promptRepository.save(updatedPrompt);
    }
    
    // If content is provided, create a new version
    if (content) {
      const newVersion = prompt.currentVersion + 1;
      
      // Create new version
      const version = this.promptVersionRepository.create({
        version: newVersion,
        content,
        promptId: prompt.id,
        createdById: updatePromptInput.ownerId,
      });
      
      // Save the version
      await this.promptVersionRepository.save(version);
      
      // Update prompt current version
      await this.promptRepository.update(id, { currentVersion: newVersion });
    }
    
    // Return the updated prompt with versions
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const prompt = await this.findOne(id);
    
    // Delete versions first (cascade should handle this, but being explicit)
    await this.promptVersionRepository.delete({ promptId: id });
    
    // Delete the prompt
    const result = await this.promptRepository.remove(prompt);
    return !!result;
  }

  async findByOwnerId(ownerId: string): Promise<Prompt[]> {
    return this.promptRepository.find({ 
      where: { ownerId },
      relations: ['versions'],
    });
  }

  async findPublicPrompts(): Promise<Prompt[]> {
    return this.promptRepository.find({ 
      where: { isPublic: true },
      relations: ['versions'],
    });
  }

  async getVersion(promptId: string, version: number): Promise<PromptVersion> {
    const promptVersion = await this.promptVersionRepository.findOne({
      where: { promptId, version },
    });
    
    if (!promptVersion) {
      throw new NotFoundException(`Version ${version} not found for prompt ${promptId}`);
    }
    
    return promptVersion;
  }

  async getCurrentVersion(promptId: string): Promise<PromptVersion> {
    const prompt = await this.findOne(promptId);
    return this.getVersion(promptId, prompt.currentVersion);
  }

  async getContent(promptId: string, version?: number): Promise<string> {
    let promptVersion: PromptVersion;
    
    if (version) {
      promptVersion = await this.getVersion(promptId, version);
    } else {
      promptVersion = await this.getCurrentVersion(promptId);
    }
    
    return promptVersion.content;
  }
}
