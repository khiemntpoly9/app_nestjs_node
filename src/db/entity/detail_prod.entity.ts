/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'detail_product' })
export class DeltailProd {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_detail: number;

  @Column({ type: 'int' })
  id_product: number;

  @Column({ type: 'text' })
  detail_prod: string;

  @Column({ type: 'text' })
  description_prod: string;

  @Column({ type: 'text' })
  specification_prod: string;

  @Column({ type: 'text' })
  preserve_prod: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @OneToOne(() => Product, (product) => product.detail_prod)
  @JoinColumn({ name: 'id_product' })
  product: Product;
}
