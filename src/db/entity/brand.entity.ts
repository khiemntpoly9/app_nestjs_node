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

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_brand: number;

  @Column({ type: 'varchar', length: 255 })
  name_brand: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.brands)
  product: Product[];
}
