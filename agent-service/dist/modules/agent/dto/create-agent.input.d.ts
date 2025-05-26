export declare class CreateAgentInput {
    name: string;
    description?: string;
    promptId: string;
    modelId: string;
    memoryEnabled?: boolean;
    enabledTools?: string[];
    allowedKnowledgeBases?: string[];
    isActive?: boolean;
    isPublic?: boolean;
    ownerId?: string;
}
