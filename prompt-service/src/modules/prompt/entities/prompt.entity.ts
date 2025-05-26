import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { PromptVersion } from './prompt-version.entity';

@ObjectType()
@Entity('prompts')
export class Prompt {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 100 })
  name: string;

  @Field({ nullable: true })
  @Column({ length: 500, nullable: true })
  description: string;

  @Field(() => [String])
  @Column('simple-array', { default: '' })
  tags: string[];

  @Field()
  @Column({ default: 1 })
  currentVersion: number;

  @Field()
  @Column({ default: false })
  isPublic: boolean;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  ownerId: string;

  @Field(() => [PromptVersion])
  @OneToMany(() => PromptVersion, version => version.prompt, { eager: true, cascade: true })
  versions: PromptVersion[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
