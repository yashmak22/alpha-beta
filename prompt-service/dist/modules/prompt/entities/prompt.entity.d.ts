import { PromptVersion } from './prompt-version.entity';
export declare class Prompt {
    id: string;
    name: string;
    description: string;
    tags: string[];
    currentVersion: number;
    isPublic: boolean;
    ownerId: string;
    versions: PromptVersion[];
    createdAt: Date;
    updatedAt: Date;
}
