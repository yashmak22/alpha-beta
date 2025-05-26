import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateAgentInput } from './create-agent.input';

@InputType()
export class UpdateAgentInput extends PartialType(CreateAgentInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
