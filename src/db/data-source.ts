/* eslint-disable prettier/prettier */
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  charset: 'utf8mb4_unicode_ci',
  timezone: '+07:00',
  logging: false,
  synchronize: false,
  subscribers: [],
  migrations: [],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
