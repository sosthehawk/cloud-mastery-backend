import { IsNotEmpty, IsOptional, IsArray, ValidateNested, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderDto {
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

  @IsOptional()
  status?: string; //pending, completed

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  items: UpdateOrderItemDto[];
}

export class UpdateOrderItemDto {
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