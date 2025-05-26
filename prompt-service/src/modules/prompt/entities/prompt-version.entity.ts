import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Prompt } from './prompt.entity';

@ObjectType()
@Entity('prompt_versions')
export class PromptVersion {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Int)
  @Column()
  version: number;

  @Field()
  @Column('text')
  content: string;

  @Field(() => Prompt)
  @ManyToOne(() => Prompt, prompt => prompt.versions)
  @JoinColumn({ name: 'promptId' })
  prompt: Prompt;

  @Field()
  @Column('uuid')
  promptId: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  createdById: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
