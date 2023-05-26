/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'colors' })
export class Color {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_color: number;

  @Column({ type: 'varchar', length: 30 })
  name_color: string;

  @Column({ type: 'varchar', length: 7 })
  hex_color: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Màu với sản phẩm
  @ManyToMany(() => Product, (product) => product.color)
  product: Product[];
}
