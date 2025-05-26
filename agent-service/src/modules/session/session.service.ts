import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { CreateSessionInput } from './dto/create-session.input';
import { UpdateSessionInput } from './dto/update-session.input';
import { AgentService } from '../agent/agent.service';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private agentService: AgentService,
  ) {}

  async findAll(): Promise<Session[]> {
    return this.sessionRepository.find({ relations: ['agent'] });
  }

  async findOne(id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({ 
      where: { id },
      relations: ['agent']
    });
    
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    
    return session;
  }

  async create(createSessionInput: CreateSessionInput): Promise<Session> {
    // Verify that the agent exists
    await this.agentService.findOne(createSessionInput.agentId);
    
    const session = this.sessionRepository.create({
      ...createSessionInput,
      isActive: true,
    });
    
    return this.sessionRepository.save(session);
  }

  async update(id: string, updateSessionInput: UpdateSessionInput): Promise<Session> {
    const session = await this.findOne(id);
    const updatedSession = this.sessionRepository.merge(session, updateSessionInput);
    return this.sessionRepository.save(updatedSession);
  }

  async remove(id: string): Promise<boolean> {
    const session = await this.findOne(id);
    const result = await this.sessionRepository.remove(session);
    return !!result;
  }

  async findByAgentId(agentId: string): Promise<Session[]> {
    return this.sessionRepository.find({ 
      where: { agentId },
      relations: ['agent']
    });
  }

  async findByUserId(userId: string): Promise<Session[]> {
    return this.sessionRepository.find({ 
      where: { userId },
      relations: ['agent']
    });
  }

  async findActiveSessions(): Promise<Session[]> {
    return this.sessionRepository.find({ 
      where: { isActive: true },
      relations: ['agent']
    });
  }

  async endSession(id: string): Promise<Session> {
    const session = await this.findOne(id);
    session.isActive = false;
    session.endedAt = new Date();
    return this.sessionRepository.save(session);
  }
}
