/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Material {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_material: number;

  @Column({ type: 'varchar', length: 255 })
  name_material: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
