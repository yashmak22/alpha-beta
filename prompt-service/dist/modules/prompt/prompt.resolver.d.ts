import { Prompt } from './entities/prompt.entity';
import { PromptVersion } from './entities/prompt-version.entity';
import { PromptService } from './prompt.service';
import { CreatePromptInput } from './dto/create-prompt.input';
import { UpdatePromptInput } from './dto/update-prompt.input';
export declare class PromptResolver {
    private readonly promptService;
    constructor(promptService: PromptService);
    findAll(): Promise<Prompt[]>;
    findOne(id: string): Promise<Prompt>;
    findByOwnerId(ownerId: string): Promise<Prompt[]>;
    findPublicPrompts(): Promise<Prompt[]>;
    getVersion(promptId: string, version: number): Promise<PromptVersion>;
    getCurrentVersion(promptId: string): Promise<PromptVersion>;
    getContent(promptId: string, version?: number): Promise<string>;
    createPrompt(createPromptInput: CreatePromptInput): Promise<Prompt>;
    updatePrompt(updatePromptInput: UpdatePromptInput): Promise<Prompt>;
    removePrompt(id: string): Promise<boolean>;
}
