import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Agent } from './entities/agent.entity';
import { AgentService } from './agent.service';
import { CreateAgentInput } from './dto/create-agent.input';
import { UpdateAgentInput } from './dto/update-agent.input';

@Resolver(() => Agent)
export class AgentResolver {
  constructor(private readonly agentService: AgentService) {}

  @Query(() => [Agent], { name: 'agents' })
  async findAll(): Promise<Agent[]> {
    return this.agentService.findAll();
  }

  @Query(() => Agent, { name: 'agent' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Agent> {
    return this.agentService.findOne(id);
  }

  @Query(() => [Agent], { name: 'agentsByOwner' })
  async findByOwnerId(@Args('ownerId', { type: () => ID }) ownerId: string): Promise<Agent[]> {
    return this.agentService.findByOwnerId(ownerId);
  }

  @Query(() => [Agent], { name: 'publicAgents' })
  async findPublicAgents(): Promise<Agent[]> {
    return this.agentService.findPublicAgents();
  }

  @Mutation(() => Agent)
  async createAgent(@Args('createAgentInput') createAgentInput: CreateAgentInput): Promise<Agent> {
    return this.agentService.create(createAgentInput);
  }

  @Mutation(() => Agent)
  async updateAgent(@Args('updateAgentInput') updateAgentInput: UpdateAgentInput): Promise<Agent> {
    return this.agentService.update(updateAgentInput.id, updateAgentInput);
  }

  @Mutation(() => Boolean)
  async removeAgent(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.agentService.remove(id);
  }
}
