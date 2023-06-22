import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Category } from './categories.entity';
import { Product } from './product.entity';

export enum ActionType {
	'CREATE' = 'create',
	'UPDATE' = 'update',
	'DELETE' = 'delete',
}
@Entity({ name: 'action_history' })
export class ActionHistory {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id_history: number;

	@Column({ type: 'int', nullable: false })
	id_user: number;

	@Column({ type: 'enum', enum: ActionType, default: ActionType.CREATE, nullable: false })
	action_type: ActionType;

	@Column({ type: 'int', nullable: true, default: null })
	id_product: number;

	@Column({ type: 'int', nullable: true, default: null })
	id_categories: number;

	@Column({ type: 'text', nullable: false })
	content: string;

	@CreateDateColumn({ type: 'timestamp', nullable: false })
	action_date: Date;

	// Mối quan hệ với categories
	@ManyToOne(() => Category, (category) => category.action_history)
	@JoinColumn({ name: 'id_categories', referencedColumnName: 'id_categories' })
	categories: Category;

	// Mối quan hệ với product
	@ManyToOne(() => Product, (product) => product.action_history)
	@JoinColumn({ name: 'id_product', referencedColumnName: 'id_product' })
	products: Product;

	// Mối quan hệ với users
	@ManyToOne(() => User, (user) => user.actionh)
	@JoinColumn({ name: 'id_user', referencedColumnName: 'id_user' })
	users: User;
}
