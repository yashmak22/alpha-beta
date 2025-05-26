import { Agent } from './entities/agent.entity';
import { AgentService } from './agent.service';
import { CreateAgentInput } from './dto/create-agent.input';
import { UpdateAgentInput } from './dto/update-agent.input';
export declare class AgentResolver {
    private readonly agentService;
    constructor(agentService: AgentService);
    findAll(): Promise<Agent[]>;
    findOne(id: string): Promise<Agent>;
    findByOwnerId(ownerId: string): Promise<Agent[]>;
    findPublicAgents(): Promise<Agent[]>;
    createAgent(createAgentInput: CreateAgentInput): Promise<Agent>;
    updateAgent(updateAgentInput: UpdateAgentInput): Promise<Agent>;
    removeAgent(id: string): Promise<boolean>;
}
