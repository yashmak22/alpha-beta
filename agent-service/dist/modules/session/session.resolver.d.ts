import { Session } from './entities/session.entity';
import { Agent } from '../agent/entities/agent.entity';
import { SessionService } from './session.service';
import { AgentService } from '../agent/agent.service';
import { CreateSessionInput } from './dto/create-session.input';
import { UpdateSessionInput } from './dto/update-session.input';
export declare class SessionResolver {
    private readonly sessionService;
    private readonly agentService;
    constructor(sessionService: SessionService, agentService: AgentService);
    findAll(): Promise<Session[]>;
    findOne(id: string): Promise<Session>;
    findByAgentId(agentId: string): Promise<Session[]>;
    findByUserId(userId: string): Promise<Session[]>;
    findActiveSessions(): Promise<Session[]>;
    createSession(createSessionInput: CreateSessionInput): Promise<Session>;
    updateSession(updateSessionInput: UpdateSessionInput): Promise<Session>;
    removeSession(id: string): Promise<boolean>;
    endSession(id: string): Promise<Session>;
    agent(session: Session): Promise<Agent>;
}
