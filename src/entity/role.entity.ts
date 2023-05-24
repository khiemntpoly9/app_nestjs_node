/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_role: number;

  @Column({ type: 'varchar', length: 50 })
  name_role: number;

  @Column({ type: 'varchar', length: 20 })
  short_role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
