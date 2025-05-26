import { Agent } from '../../agent/entities/agent.entity';
export declare class Session {
    id: string;
    name: string;
    agent: Agent;
    agentId: string;
    isActive: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    endedAt: Date;
}
