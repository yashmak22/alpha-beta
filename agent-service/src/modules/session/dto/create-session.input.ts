import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateSessionInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  agentId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  userId?: string;
}
