import { IsNotEmpty, IsOptional, IsArray, ValidateNested, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNotEmpty()
  customerId: string;

  @IsNotEmpty()
  orderAmount: string;

  @IsNotEmpty()
  orderDate: Date;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  paymentMethod: string;

  @IsNotEmpty()
  shippingAddress: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  unitCost: number;
}