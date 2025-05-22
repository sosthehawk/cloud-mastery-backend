import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create 10 customers
  const customers = [
    {
      firstName: 'Alice',
      lastName: 'Wanjiru',
      email: 'alice.wanjiru@example.com',
      phone: '+254712345678',
      address: '789 Kimathi St',
      city: 'Nairobi',
    },
    {
      firstName: 'Bob',
      lastName: 'Ochieng',
      email: 'bob.ochieng@example.com',
      phone: '+254723456789',
      address: '456 Moi Ave',
      city: 'Mombasa',
    },
    {
      firstName: 'Catherine',
      lastName: 'Njeri',
      email: 'catherine.njeri@example.com',
      phone: '+254734567890',
      address: '123 Oginga Odinga Rd',
      city: 'Kisumu',
    },
    {
      firstName: 'David',
      lastName: 'Mutua',
      email: 'david.mutua@example.com',
      phone: '+254745678901',
      address: '321 Kenyatta Ave',
      city: 'Nakuru',
    },
    {
      firstName: 'Eva',
      lastName: 'Akinyi',
      email: 'eva.akinyi@example.com',
      phone: '+254756789012',
      address: '654 Uhuru Highway',
      city: 'Eldoret',
    },
    {
      firstName: 'Francis',
      lastName: 'Kiprotich',
      email: 'francis.kiprotich@example.com',
      phone: '+254767890123',
      address: '987 Mombasa Rd',
      city: 'Nairobi',
    },
    {
      firstName: 'Grace',
      lastName: 'Wangari',
      email: 'grace.wangari@example.com',
      phone: '+254778901234',
      address: '246 Haile Selassie Ave',
      city: 'Nairobi',
    },
    {
      firstName: 'Henry',
      lastName: 'Otieno',
      email: 'henry.otieno@example.com',
      phone: '+254789012345',
      address: '135 Tom Mboya St',
      city: 'Nairobi',
    },
    {
      firstName: 'Irene',
      lastName: 'Chebet',
      email: 'irene.chebet@example.com',
      phone: '+254790123456',
      address: '579 Langata Rd',
      city: 'Nairobi',
    },
    {
      firstName: 'James',
      lastName: 'Mwangi',
      email: 'james.mwangi@example.com',
      phone: '+254701234567',
      address: '864 Waiyaki Way',
      city: 'Nairobi',
    },
  ];

  console.log('Creating customers...');
  const createdCustomers = [];
  for (const customer of customers) {
    const createdCustomer = await prisma.customer.create({ data: customer });
    createdCustomers.push(createdCustomer);
  }

  // Create 10 products
  const products = [
    {
      name: 'Laptop Dell Inspiron',
      description: 'High-performance laptop for business and gaming',
      category: 'Electronics',
      unitCost: 85000.00,
      quantity: 25,
      totalCost: 2125000.00,
    },
    {
      name: 'Samsung Galaxy S23',
      description: 'Latest flagship smartphone with advanced camera',
      category: 'Electronics',
      unitCost: 95000.00,
      quantity: 30,
      totalCost: 2850000.00,
    },
    {
      name: 'Office Chair Ergonomic',
      description: 'Comfortable ergonomic office chair with lumbar support',
      category: 'Furniture',
      unitCost: 15000.00,
      quantity: 50,
      totalCost: 750000.00,
    },
    {
      name: 'Coffee Maker Deluxe',
      description: 'Automatic coffee maker with programmable settings',
      category: 'Appliances',
      unitCost: 8500.00,
      quantity: 40,
      totalCost: 340000.00,
    },
    {
      name: 'Wireless Bluetooth Headphones',
      description: 'Noise-cancelling wireless headphones with premium sound',
      category: 'Electronics',
      unitCost: 12000.00,
      quantity: 60,
      totalCost: 720000.00,
    },
    {
      name: 'Study Desk Modern',
      description: 'Modern study desk with storage compartments',
      category: 'Furniture',
      unitCost: 18000.00,
      quantity: 20,
      totalCost: 360000.00,
    },
    {
      name: 'Electric Kettle Steel',
      description: 'Stainless steel electric kettle with auto shut-off',
      category: 'Appliances',
      unitCost: 3500.00,
      quantity: 75,
      totalCost: 262500.00,
    },
    {
      name: 'Gaming Mouse RGB',
      description: 'High-precision gaming mouse with RGB lighting',
      category: 'Electronics',
      unitCost: 4500.00,
      quantity: 45,
      totalCost: 202500.00,
    },
    {
      name: 'Bookshelf Wooden',
      description: 'Solid wood bookshelf with 5 shelves',
      category: 'Furniture',
      unitCost: 22000.00,
      quantity: 15,
      totalCost: 330000.00,
    },
    {
      name: 'Blender High Speed',
      description: 'High-speed blender for smoothies and food processing',
      category: 'Appliances',
      unitCost: 6800.00,
      quantity: 35,
      totalCost: 238000.00,
    },
  ];

  console.log('Creating products...');
  const createdProducts = [];
  for (const product of products) {
    const createdProduct = await prisma.product.create({ data: product });
    createdProducts.push(createdProduct);
  }

  // Create 10 orders with order details
  console.log('Creating orders with details...');
  const paymentMethods = ['VISA', 'MASTERCARD', 'PAYPAL', 'CASH', 'BANK_TRANSFER'];
  const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  for (let i = 0; i < 10; i++) {
    const customer = createdCustomers[i];
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days

    // Randomly select 1-3 products for this order
    const numberOfItems = Math.floor(Math.random() * 3) + 1;
    const selectedProducts = [];
    const usedIndices = new Set();

    while (selectedProducts.length < numberOfItems) {
      const randomIndex = Math.floor(Math.random() * createdProducts.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        selectedProducts.push(createdProducts[randomIndex]);
      }
    }

    // Calculate order total
    let orderTotal = 0;
    const orderItems = selectedProducts.map(product => {
      const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 quantity
      const itemTotal = Number(product.unitCost) * quantity;
      orderTotal += itemTotal;

      return {
        customerId: customer.id,
        productId: product.id,
        unitCost: product.unitCost,
        quantity: quantity,
        totalCost: itemTotal,
      };
    });

    // Create order with items
    await prisma.order.create({
      data: {
        customerId: customer.id,
        orderNumber: `ORD-${Date.now()}-${i + 1}`,
        orderAmount: orderTotal,
        orderDate: orderDate,
        description: `Order for ${customer.firstName} ${customer.lastName}`,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        shippingAddress: `${customer.address}, ${customer.city}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        items: {
          create: orderItems
        }
      },
      include: {
        items: true
      }
    });
  }

  console.log('Seed completed successfully!');
  console.log(`Created ${createdCustomers.length} customers`);
  console.log(`Created ${createdProducts.length} products`);
  console.log('Created 10 orders with their details');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });