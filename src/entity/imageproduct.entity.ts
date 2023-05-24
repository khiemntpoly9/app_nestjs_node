/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ImgProduct {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_images: number;

  @Column({ type: 'int' })
  id_product: number;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
