/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ProductHistory {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_history: number;

  @Column({ type: 'int' })
  id_product: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price_prod: string;

  @Column({ type: 'int' })
  id_user: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
