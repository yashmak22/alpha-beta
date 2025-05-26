import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('prompt_templates')
export class PromptTemplate {
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
  @Column('text')
  content: string;

  @Field(() => [String])
  @Column('simple-array', { default: '' })
  tags: string[];

  @Field()
  @Column()
  category: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column({ default: true })
  isPublic: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  createdById: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
