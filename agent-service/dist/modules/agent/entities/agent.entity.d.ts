import { Session } from '../../session/entities/session.entity';
export declare class Agent {
    id: string;
    name: string;
    description: string;
    promptId: string;
    modelId: string;
    memoryEnabled: boolean;
    enabledTools: string[];
    allowedKnowledgeBases: string[];
    isActive: boolean;
    isPublic: boolean;
    ownerId: string;
    sessions: Session[];
    createdAt: Date;
    updatedAt: Date;
}
