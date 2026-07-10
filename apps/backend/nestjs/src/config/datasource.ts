import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: ['.env', '.env.local', '.env.production'] });

const isProduction = process.env.NODE_ENV === 'production';

// TypeORM DataSource for migrations (run outside of NestJS context)
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'zimvisit',
  password: process.env.DB_PASSWORD || 'zimvisit_secret',
  database: process.env.DB_DATABASE || 'zimvisit',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  logging: !isProduction,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});
