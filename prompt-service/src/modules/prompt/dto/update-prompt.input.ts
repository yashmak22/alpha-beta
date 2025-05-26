import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreatePromptInput } from './create-prompt.input';

@InputType()
export class UpdatePromptInput extends PartialType(CreatePromptInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
