import { Repository } from 'typeorm';
import { Prompt } from './entities/prompt.entity';
import { PromptVersion } from './entities/prompt-version.entity';
import { CreatePromptInput } from './dto/create-prompt.input';
import { UpdatePromptInput } from './dto/update-prompt.input';
export declare class PromptService {
    private promptRepository;
    private promptVersionRepository;
    constructor(promptRepository: Repository<Prompt>, promptVersionRepository: Repository<PromptVersion>);
    findAll(): Promise<Prompt[]>;
    findOne(id: string): Promise<Prompt>;
    create(createPromptInput: CreatePromptInput): Promise<Prompt>;
    update(id: string, updatePromptInput: UpdatePromptInput): Promise<Prompt>;
    remove(id: string): Promise<boolean>;
    findByOwnerId(ownerId: string): Promise<Prompt[]>;
    findPublicPrompts(): Promise<Prompt[]>;
    getVersion(promptId: string, version: number): Promise<PromptVersion>;
    getCurrentVersion(promptId: string): Promise<PromptVersion>;
    getContent(promptId: string, version?: number): Promise<string>;
}
