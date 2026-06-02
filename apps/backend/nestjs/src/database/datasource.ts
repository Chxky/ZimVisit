import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'zimvisit',
  password: process.env.DB_PASSWORD || 'zimvisit_secret',
  database: process.env.DB_DATABASE || 'zimvisit',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
};

const dataSource = new DataSource(options);
export default dataSource;
