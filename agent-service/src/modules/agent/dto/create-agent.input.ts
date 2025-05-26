import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

@InputType()
export class CreateAgentInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  promptId: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  modelId: string;

  @Field({ defaultValue: false })
  @IsOptional()
  @IsBoolean()
  memoryEnabled?: boolean;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  enabledTools?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  allowedKnowledgeBases?: string[];

  @Field({ defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ownerId?: string;
}
