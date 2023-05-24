/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_product: number;

  @Column({ type: 'varchar', length: 255 })
  name_prod: string;

  @Column({ type: 'int' })
  id_categories: number;

  @Column({ type: 'int' })
  brand_prod: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price_prod: number;

  @Column({ type: 'int' })
  material_prod: number;

  @Column({ type: 'int' })
  style_prod: number;

  @Column({ type: 'varchar', length: 255 })
  img_thumbnail: string;

  @Column({ type: 'int' })
  discount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
