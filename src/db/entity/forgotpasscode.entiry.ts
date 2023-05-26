/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Forgotpasscode {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_code: number;

  @Column({ type: 'varchar', length: 255 })
  email_user: string;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @CreateDateColumn()
  createdAt: Date;
}
