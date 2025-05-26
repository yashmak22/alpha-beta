import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateTemplateInput } from './create-template.input';

@InputType()
export class UpdateTemplateInput extends PartialType(CreateTemplateInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
