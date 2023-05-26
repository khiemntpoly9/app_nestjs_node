/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'categories' })
export class Categories {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_categories: number;

  @Column({ type: 'varchar', length: 255 })
  name_categories: string;

  @Column({ type: 'int' })
  parent_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.categories)
  product: Product[];
}
