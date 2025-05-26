import { Prompt } from './prompt.entity';
export declare class PromptVersion {
    id: string;
    version: number;
    content: string;
    prompt: Prompt;
    promptId: string;
    createdById: string;
    createdAt: Date;
}
