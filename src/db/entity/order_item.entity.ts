/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity({ name: 'order_item' })
export class OrderItem {
	@PrimaryGeneratedColumn({ type: 'bigint', name: 'id_order_item' })
	id_order_item: number;

	@Column({ type: 'bigint', name: 'id_order' })
	id_order: number;

	@Column({ type: 'bigint', name: 'id_product' })
	id_product: number;

	@Column({ type: 'int' })
	quantity: number;

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
	price: number;

	@ManyToOne(() => Order, (order) => order.order_items)
	@JoinColumn({ name: 'id_order', referencedColumnName: 'id_order' })
	order: Order;

	@ManyToOne(() => Product, (product) => product.orderItems)
	@JoinColumn({ name: 'id_product', referencedColumnName: 'id_product' })
	product: Product;
}
