import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prompt } from './entities/prompt.entity';
import { PromptVersion } from './entities/prompt-version.entity';
import { PromptService } from './prompt.service';
import { PromptResolver } from './prompt.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Prompt, PromptVersion])],
  providers: [PromptService, PromptResolver],
  exports: [PromptService],
})
export class PromptModule {}
