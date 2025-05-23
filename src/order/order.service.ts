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
        //@ts-ignore
        status: orderData.status || 'pending',
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
        customer: {
          select: {
            firstName: true,
            lastName: true,
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    });

    // Transform the result to include names
    return {
      ...order,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      items: order.items.map(item => ({
        ...item,
        productName: item.product.name
      }))
    };
  }

  async findAll() {
    const orders = await this.prisma.order.findMany({
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(order => ({
      id: order.id,
      customerId: order.customerId,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      orderNumber: order.orderNumber,
      orderAmount: order.orderAmount,
      orderDate: order.orderDate,
      description: order.description,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        unitCost: item.unitCost,
        quantity: item.quantity,
        totalCost: item.totalCost
      }))
    }));
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                description: true,
                unitCost: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      id: order.id,
      customerId: order.customerId,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      orderNumber: order.orderNumber,
      orderAmount: order.orderAmount,
      orderDate: order.orderDate,
      description: order.description,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        productDescription: item.product.description,
        productUnitCost: item.product.unitCost,
        unitCost: item.unitCost,
        quantity: item.quantity,
        totalCost: item.totalCost
      }))
    };
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    // Calculate new total if items are being updated
    // Initialize with existing order amount
    let calculatedTotal = existingOrder.orderAmount;
    
    if (updateOrderDto.items) {
      // Convert the reduced number to Decimal
      calculatedTotal = new Prisma.Decimal(
        updateOrderDto.items.reduce((sum, item) => {
          return sum + (Number(item.unitCost) * item.quantity);
        }, 0)
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        customerId: updateOrderDto.customerId,
        orderAmount: new Prisma.Decimal(calculatedTotal),
        orderDate: updateOrderDto.orderDate,
        description: updateOrderDto.description,
        paymentMethod: updateOrderDto.paymentMethod,
        shippingAddress: updateOrderDto.shippingAddress,
        status: updateOrderDto.status,
        ...(updateOrderDto.items && {
          items: {
            deleteMany: {}, // Remove existing items
            create: updateOrderDto.items.map(item => ({
              customerId: updateOrderDto.customerId,
              productId: item.productId,
              unitCost: new Prisma.Decimal(item.unitCost),
              quantity: item.quantity,
              totalCost: new Prisma.Decimal(Number(item.unitCost) * item.quantity)
            }))
          }
        })
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    });

    return {
      ...updatedOrder,
      customerName: `${updatedOrder.customer.firstName} ${updatedOrder.customer.lastName}`,
      items: updatedOrder.items.map(item => ({
        ...item,
        productName: item.product.name
      }))
    };
  }

  async remove(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // First delete order items to maintain referential integrity
    await this.prisma.order_detail.deleteMany({
      where: { orderId: id }
    });

    // Then delete the order
    await this.prisma.order.delete({
      where: { id },
    });

    return { message: 'Order deleted successfully' };
  }
}