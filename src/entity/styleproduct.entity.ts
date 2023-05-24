/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class StyleProduct {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_style: number;

  @Column({ type: 'varchar', length: 255 })
  name_style: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
