import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { Session } from './entities/session.entity';
import { Agent } from '../agent/entities/agent.entity';
import { SessionService } from './session.service';
import { AgentService } from '../agent/agent.service';
import { CreateSessionInput } from './dto/create-session.input';
import { UpdateSessionInput } from './dto/update-session.input';

@Resolver(() => Session)
export class SessionResolver {
  constructor(
    private readonly sessionService: SessionService,
    private readonly agentService: AgentService,
  ) {}

  @Query(() => [Session], { name: 'sessions' })
  async findAll(): Promise<Session[]> {
    return this.sessionService.findAll();
  }

  @Query(() => Session, { name: 'session' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Session> {
    return this.sessionService.findOne(id);
  }

  @Query(() => [Session], { name: 'sessionsByAgent' })
  async findByAgentId(@Args('agentId', { type: () => ID }) agentId: string): Promise<Session[]> {
    return this.sessionService.findByAgentId(agentId);
  }

  @Query(() => [Session], { name: 'sessionsByUser' })
  async findByUserId(@Args('userId', { type: () => ID }) userId: string): Promise<Session[]> {
    return this.sessionService.findByUserId(userId);
  }

  @Query(() => [Session], { name: 'activeSessions' })
  async findActiveSessions(): Promise<Session[]> {
    return this.sessionService.findActiveSessions();
  }

  @Mutation(() => Session)
  async createSession(@Args('createSessionInput') createSessionInput: CreateSessionInput): Promise<Session> {
    return this.sessionService.create(createSessionInput);
  }

  @Mutation(() => Session)
  async updateSession(@Args('updateSessionInput') updateSessionInput: UpdateSessionInput): Promise<Session> {
    return this.sessionService.update(updateSessionInput.id, updateSessionInput);
  }

  @Mutation(() => Boolean)
  async removeSession(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.sessionService.remove(id);
  }

  @Mutation(() => Session)
  async endSession(@Args('id', { type: () => ID }) id: string): Promise<Session> {
    return this.sessionService.endSession(id);
  }

  @ResolveField(() => Agent)
  async agent(@Parent() session: Session): Promise<Agent> {
    if (session.agent) {
      return session.agent;
    }
    return this.agentService.findOne(session.agentId);
  }
}
