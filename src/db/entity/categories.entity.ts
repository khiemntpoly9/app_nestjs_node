/* eslint-disable prettier/prettier */
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ActionHistory } from './action_history.entity';

@Entity({ name: 'categories' })
export class Category {
	@PrimaryGeneratedColumn({ type: 'int' })
	id_categories: number;

	@Column({ type: 'varchar', length: 255 })
	name_categories: string;

	@Column({ type: 'int', nullable: true })
	parent_id: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(() => Product, (product) => product.categories)
	product: Product[];

	@OneToMany(() => Category, (category) => category.parent)
	children: Category[];

	@ManyToOne(() => Category, (category) => category.children)
	@JoinColumn({ name: 'parent_id' })
	parent: Category;

	// Mối quan hệ với bảng action_history
	@OneToMany(() => ActionHistory, (action_history) => action_history.categories)
	action_history: ActionHistory[];
}
