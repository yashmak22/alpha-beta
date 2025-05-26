import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptTemplate } from './entities/template.entity';
import { TemplateService } from './template.service';
import { TemplateResolver } from './template.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PromptTemplate])],
  providers: [TemplateService, TemplateResolver],
  exports: [TemplateService],
})
export class TemplateModule {}
