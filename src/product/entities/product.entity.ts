export class Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  unitCost: number;
  quantity: number;
  totalCost:number;
  createdAt: Date;
  updatedAt: Date;
}