import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';
import { SessionResolver } from './session.resolver';
import { AgentModule } from '../agent/agent.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    AgentModule,
  ],
  providers: [SessionService, SessionResolver],
  exports: [SessionService],
})
export class SessionModule {}
