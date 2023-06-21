/* eslint-disable prettier/prettier */
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	// ManyToMany,
	ManyToOne,
	JoinColumn,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

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

	@ManyToMany(() => User, (user) => user.categories)
	@JoinTable({
		name: 'action_history',
		joinColumn: { name: 'id', referencedColumnName: 'id_categories' },
		inverseJoinColumn: { name: 'id_user', referencedColumnName: 'id_user' },
	})
	user: User[];
}
