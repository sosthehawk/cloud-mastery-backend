import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items, ...orderData } = createOrderDto;
    
    // Calculate total amount from items
    const calculatedTotal = items.reduce((sum, item) => {
      return sum + (Number(item.unitCost) * item.quantity);
    }, 0);

    const order = await this.prisma.order.create({
      data: {
        customerId: orderData.customerId,
        orderAmount: new Prisma.Decimal(calculatedTotal),
        orderDate: orderData.orderDate,
        description: orderData.description,
        paymentMethod: orderData.paymentMethod,
        shippingAddress: orderData.shippingAddress,
        items: {
          create: items.map(item => ({
            customerId: orderData.customerId,
            productId: item.productId,
            unitCost: new Prisma.Decimal(item.unitCost),
            quantity: item.quantity,
            totalCost: new Prisma.Decimal(Number(item.unitCost) * item.quantity)
          }))
        }
      },
      include: {
        items: true
      }
    });
    return order;
  }

  async findAll() {
    const orders = await this.prisma.order.findMany({
      include: {
        items: true
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders;
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true
      }
    });
    if (!order) {
      throw new NotFoundException();
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException();
    }

    const updatedData = await this.prisma.order.update({
      where: { id },
      data: {
        customerId: updateOrderDto.customerId,
        orderAmount: updateOrderDto.orderAmount,
        orderDate: updateOrderDto.orderDate,
        description: updateOrderDto.description,
        paymentMethod: updateOrderDto.paymentMethod,
        shippingAddress: updateOrderDto.shippingAddress,
      },
      include: {
        items: true
      }
    });
    return updatedData;
  }

  async remove(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException();
    }
    const deletedData = await this.prisma.order.delete({
      where: { id },
    });
    return deletedData;
  }
}