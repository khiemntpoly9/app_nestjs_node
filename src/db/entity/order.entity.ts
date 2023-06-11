/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id_order: number;

	@Column({ type: 'int' })
	id_user: number;

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
	total: number;

	@Column({ type: 'tinyint', default: 0 })
	status: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
