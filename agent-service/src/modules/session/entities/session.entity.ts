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
import { Agent } from '../../agent/entities/agent.entity';

@ObjectType()
@Entity('sessions')
export class Session {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 100, nullable: true })
  name: string;

  @Field(() => Agent)
  @ManyToOne(() => Agent, agent => agent.sessions)
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @Field()
  @Column('uuid')
  agentId: string;

  @Field()
  @Column({ default: false })
  isActive: boolean;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  userId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  endedAt: Date;
}
