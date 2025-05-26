import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity';
import { AgentService } from './agent.service';
import { AgentResolver } from './agent.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Agent])],
  providers: [AgentService, AgentResolver],
  exports: [AgentService],
})
export class AgentModule {}
