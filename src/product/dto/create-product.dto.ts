import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
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
}

