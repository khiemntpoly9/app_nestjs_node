/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'img_product' })
export class ImgProduct {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_images: number;

  @Column({ type: 'int' })
  id_product: number;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @ManyToOne(() => Product, (product) => product.img_prod)
  @JoinColumn({ name: 'id_product' })
  product: Product;
}
