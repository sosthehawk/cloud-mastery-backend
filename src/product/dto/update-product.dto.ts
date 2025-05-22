import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  unitCost: number;

  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  id: string;

  @IsOptional()
  createdAt: Date;

  @IsOptional()
  updatedAt: Date;
}