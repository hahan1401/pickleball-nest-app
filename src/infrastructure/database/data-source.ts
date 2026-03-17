import { join } from 'path';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const root = process.cwd();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(root, 'src/domain/entities/*.entity.{ts,js}')],
  migrations: [join(root, 'src/infrastructure/database/migrations/*.{ts,js}')],
  synchronize: false,
});
