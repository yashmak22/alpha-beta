import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Session } from '../../session/entities/session.entity';

@ObjectType()
@Entity('agents')
export class Agent {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 100 })
  name: string;

  @Field({ nullable: true })
  @Column({ length: 500, nullable: true })
  description: string;

  @Field()
  @Column('uuid')
  promptId: string;

  @Field()
  @Column('uuid')
  modelId: string;

  @Field()
  @Column({ default: false })
  memoryEnabled: boolean;

  @Field(() => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  enabledTools: string[];

  @Field(() => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  allowedKnowledgeBases: string[];

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column({ default: false })
  isPublic: boolean;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  ownerId: string;

  @Field(() => [Session], { nullable: true })
  @OneToMany(() => Session, session => session.agent)
  sessions: Session[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
