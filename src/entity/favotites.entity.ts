/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Favorites {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_favorites: number;

  @Column({ type: 'int' })
  id_user: number;

  @Column({ type: 'int' })
  id_product: number;
}
