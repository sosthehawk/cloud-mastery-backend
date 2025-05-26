# cloud-mastery-backend

Backend service built with NestJs 10. Includes unit tests to ensure robustness and efficiency.

## Installation

1. Clone the repository and then install required dependencies

```
git clone git@github.com:Pawa-IT-Solutions/cloud-mastery-backend.git
```

2. Navigate to the target directory

```
cd cloud-mastery-backend
```

3. Install dependencies

```bash
$ npm install
```

4. Configure environment variables

```
cp .env.example .env
```

```
MYSQL_PRISMA_URL="mysql://username:password@localhost:3306/database_name?sslmode=require"
```

5. Run database seed

```
npm run seed
```

## Apply migrations
1. Generate Prisma Client
```
npx prisma generate
```
2. Create and Apply Migration
```
npx prisma migrate dev --name init
```

This will create a migration file based on your schema and apply the migration to your database

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Endpoints

1. Get Customers

```
curl -X GET http://localhost:PORT/api/v1/customers
```

2. Get Products

```
curl -X GET http://localhost:PORT/api/v1/products
```

3. Get Orders

```
curl -X GET http://localhost:PORT/api/v1/orders
```
## Test

```bash
# unit tests
$ npm run test
