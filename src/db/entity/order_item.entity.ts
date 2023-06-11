/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'order_item' })
export class OrderItem {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id_order_item: number;

	@Column({ type: 'bigint' })
	id_order: number;

	@Column({ type: 'bigint' })
	id_product: number;

	@Column({ type: 'int' })
	quantity: number;

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
	price: number;
}
