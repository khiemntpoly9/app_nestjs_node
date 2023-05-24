/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
