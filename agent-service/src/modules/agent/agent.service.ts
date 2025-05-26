import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './entities/agent.entity';
import { CreateAgentInput } from './dto/create-agent.input';
import { UpdateAgentInput } from './dto/update-agent.input';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
  ) {}

  async findAll(): Promise<Agent[]> {
    return this.agentRepository.find();
  }

  async findOne(id: string): Promise<Agent> {
    const agent = await this.agentRepository.findOne({ where: { id } });
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    return agent;
  }

  async create(createAgentInput: CreateAgentInput): Promise<Agent> {
    const agent = this.agentRepository.create(createAgentInput);
    return this.agentRepository.save(agent);
  }

  async update(id: string, updateAgentInput: UpdateAgentInput): Promise<Agent> {
    const agent = await this.findOne(id);
    const updatedAgent = this.agentRepository.merge(agent, updateAgentInput);
    return this.agentRepository.save(updatedAgent);
  }

  async remove(id: string): Promise<boolean> {
    const agent = await this.findOne(id);
    const result = await this.agentRepository.remove(agent);
    return !!result;
  }

  async findByOwnerId(ownerId: string): Promise<Agent[]> {
    return this.agentRepository.find({ where: { ownerId } });
  }

  async findPublicAgents(): Promise<Agent[]> {
    return this.agentRepository.find({ where: { isPublic: true } });
  }
}
