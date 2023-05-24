/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_brand: number;

  @Column({ type: 'varchar', length: 255 })
  name_brand: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
