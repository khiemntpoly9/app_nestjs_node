/* eslint-disable prettier/prettier */
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from 'typeorm';
import { OrderItem } from './order_item.entity';

@Entity({ name: 'orders' })
export class Order {
	@PrimaryGeneratedColumn({ type: 'bigint', name: 'id_order' })
	id_order: number;

	@Column({ type: 'int', name: 'id_user' })
	id_user: number;

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
	total: number;

	@Column({ type: 'tinyint', default: 0 })
	status: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(() => OrderItem, (orderItem) => orderItem.order)
	order_items: OrderItem[];
}
