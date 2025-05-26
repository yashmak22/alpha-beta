import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

@InputType()
export class CreateTemplateInput {
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
  @IsString()
  content: string;

  @Field(() => [String], { defaultValue: [] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @Field()
  @IsNotEmpty()
  @IsString()
  category: string;

  @Field({ defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  createdById?: string;
}
