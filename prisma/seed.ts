import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed with 500 records each...');
  // Check if data already exists
  const existingCustomersCount = await prisma.customer.count();
  const existingProductsCount = await prisma.product.count();
  const existingOrdersCount = await prisma.order.count();

  if (existingCustomersCount > 0 || existingProductsCount > 0 || existingOrdersCount > 0) {
    console.log('Database already contains data, skipping seed...');
    console.log(`Found ${existingCustomersCount} customers, ${existingProductsCount} products, ${existingOrdersCount} orders`);
    return;
  }

  // Generate 500 customers
  console.log('Creating 500 customers...');
  const customers = [];
  const kenyanCities = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Machakos', 'Meru', 'Nyeri', 'Kakamega'];
  
  for (let i = 0; i < 500; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    customers.push({
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: `+2547${faker.string.numeric(8)}`, // Kenyan phone format
      address: `${faker.location.buildingNumber()} ${faker.location.streetAddress()}`,
      city: faker.helpers.arrayElement(kenyanCities),
    });
  }

  const createdCustomers = [];
  let customerBatch = [];
  const batchSize = 50; // Process in batches for better performance

  for (let i = 0; i < customers.length; i++) {
    customerBatch.push(customers[i]);
    
    if (customerBatch.length === batchSize || i === customers.length - 1) {
      try {
        const batchResults = await Promise.allSettled(
          customerBatch.map(customer => 
            prisma.customer.create({ data: customer })
          )
        );
        
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            createdCustomers.push(result.value);
          } else {
            console.log(`Failed to create customer ${customerBatch[index].email}:`, result.reason.message);
          }
        });
        
        console.log(`Created customers batch: ${Math.min(i + 1, customers.length)}/500`);
      } catch (error) {
        console.error('Batch creation error:', error);
      }
      
      customerBatch = [];
    }
  }

  // Generate 500 products
  console.log('Creating 500 products...');
  const productCategories = ['Electronics', 'Furniture', 'Appliances', 'Clothing', 'Books', 'Sports', 'Home & Garden', 'Automotive', 'Health & Beauty', 'Toys'];
  const products = [];

  for (let i = 0; i < 500; i++) {
    const category = faker.helpers.arrayElement(productCategories);
    const unitCost = parseFloat(faker.commerce.price({ min: 500, max: 150000, dec: 2 }));
    const quantity = faker.number.int({ min: 1, max: 100 });
    
    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category,
      unitCost,
      quantity,
      totalCost: unitCost * quantity,
    });
  }

  const createdProducts = [];
  let productBatch = [];

  for (let i = 0; i < products.length; i++) {
    productBatch.push(products[i]);
    
    if (productBatch.length === batchSize || i === products.length - 1) {
      try {
        const batchResults = await Promise.allSettled(
          productBatch.map(product => 
            prisma.product.create({ data: product })
          )
        );
        
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            createdProducts.push(result.value);
          } else {
            console.log(`Failed to create product ${productBatch[index].name}:`, result.reason.message);
          }
        });
        
        console.log(`Created products batch: ${Math.min(i + 1, products.length)}/500`);
      } catch (error) {
        console.error('Batch creation error:', error);
      }
      
      productBatch = [];
    }
  }

  // Generate 500 orders with order items
  if (createdCustomers.length > 0 && createdProducts.length > 0) {
    console.log('Creating 500 orders with items...');
    const paymentMethods = ['VISA', 'MASTERCARD', 'PAYPAL', 'CASH', 'BANK_TRANSFER', 'MPESA'];
    const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    let orderBatch = [];
    
    for (let i = 0; i < 500; i++) {
      const customer = faker.helpers.arrayElement(createdCustomers);
      const orderDate = faker.date.recent({ days: 90 }); // Random date within last 90 days
      const orderNumber = `ORD-${Date.now()}-${faker.string.alphanumeric(6).toUpperCase()}`;
      
      // Randomly select 1-5 products for this order
      const numberOfItems = faker.number.int({ min: 1, max: 5 });
      const selectedProducts = faker.helpers.arrayElements(createdProducts, numberOfItems);
      
      // Calculate order total and create order items
      let orderTotal = 0;
      const orderItems = selectedProducts.map(product => {
        const quantity = faker.number.int({ min: 1, max: 5 });
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

      const orderData = {
        customerId: customer.id,
        orderNumber: orderNumber,
        orderAmount: orderTotal,
        orderDate: orderDate,
        description: faker.lorem.sentence(),
        paymentMethod: faker.helpers.arrayElement(paymentMethods),
        shippingAddress: `${customer.address}, ${customer.city}`,
        status: faker.helpers.arrayElement(statuses),
        items: {
          create: orderItems
        }
      };

      orderBatch.push(orderData);
      
      if (orderBatch.length === 10 || i === 499) { // Smaller batches for orders due to complexity
        try {
          const batchResults = await Promise.allSettled(
            orderBatch.map(order => 
              prisma.order.create({
                data: order,
                include: { items: true }
              })
            )
          );
          
          const successCount = batchResults.filter(result => result.status === 'fulfilled').length;
          console.log(`Created orders batch: ${Math.min(i + 1, 500)}/500 (${successCount} successful in this batch)`);
          
        } catch (error) {
          console.error('Order batch creation error:', error);
        }
        
        orderBatch = [];
      }
    }
  }

  console.log('Seed completed successfully!');

  // Final count
  const finalCustomersCount = await prisma.customer.count();
  const finalProductsCount = await prisma.product.count();
  const finalOrdersCount = await prisma.order.count();
  //@ts-ignore
  const finalOrderItemsCount = await prisma.orderItem ? await prisma.orderItem.count() : 'N/A';
  
  console.log(`Final database state:`);
  console.log(`- Customers: ${finalCustomersCount}`);
  console.log(`- Products: ${finalProductsCount}`);
  console.log(`- Orders: ${finalOrdersCount}`);
  console.log(`- Order Items: ${finalOrderItemsCount}`);
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });