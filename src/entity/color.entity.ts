/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
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
}
