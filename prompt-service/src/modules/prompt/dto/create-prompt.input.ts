import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

@InputType()
export class CreatePromptInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => [String], { defaultValue: [] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @Field()
  @IsNotEmpty()
  @IsString()
  content: string;

  @Field({ defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ownerId?: string;
}
