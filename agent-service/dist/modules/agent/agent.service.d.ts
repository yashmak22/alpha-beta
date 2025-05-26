import { Repository } from 'typeorm';
import { Agent } from './entities/agent.entity';
import { CreateAgentInput } from './dto/create-agent.input';
import { UpdateAgentInput } from './dto/update-agent.input';
export declare class AgentService {
    private agentRepository;
    constructor(agentRepository: Repository<Agent>);
    findAll(): Promise<Agent[]>;
    findOne(id: string): Promise<Agent>;
    create(createAgentInput: CreateAgentInput): Promise<Agent>;
    update(id: string, updateAgentInput: UpdateAgentInput): Promise<Agent>;
    remove(id: string): Promise<boolean>;
    findByOwnerId(ownerId: string): Promise<Agent[]>;
    findPublicAgents(): Promise<Agent[]>;
}
