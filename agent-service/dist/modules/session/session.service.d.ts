import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { CreateSessionInput } from './dto/create-session.input';
import { UpdateSessionInput } from './dto/update-session.input';
import { AgentService } from '../agent/agent.service';
export declare class SessionService {
    private sessionRepository;
    private agentService;
    constructor(sessionRepository: Repository<Session>, agentService: AgentService);
    findAll(): Promise<Session[]>;
    findOne(id: string): Promise<Session>;
    create(createSessionInput: CreateSessionInput): Promise<Session>;
    update(id: string, updateSessionInput: UpdateSessionInput): Promise<Session>;
    remove(id: string): Promise<boolean>;
    findByAgentId(agentId: string): Promise<Session[]>;
    findByUserId(userId: string): Promise<Session[]>;
    findActiveSessions(): Promise<Session[]>;
    endSession(id: string): Promise<Session>;
}
