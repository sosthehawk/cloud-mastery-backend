export class Order {
  id: string;
  customerId: string;
  orderNumber?: string;
  orderAmount: number;
  orderDate: Date;
  paymentMethod: string; // cash, bank
  shippingAddress: string;
  status?: string; //pending, completed
  createdAt: Date;
  updatedAt: Date;
}

export class OrderDetail {
  id: string;
  orderId: string;
  customerId: string;
  productId: string;
  unitCost: number;
  quantity: number;
  totalCost:number;
  createdAt: Date;
  updatedAt: Date;
}
