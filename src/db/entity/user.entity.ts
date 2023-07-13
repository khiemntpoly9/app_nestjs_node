/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn,
	ManyToOne,
	ManyToMany,
	JoinTable,
	OneToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { Product } from './product.entity';
import { ActionHistory } from './action_history.entity';

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn({ type: 'int' })
	id_user: number;

	@Column({ type: 'varchar', length: 255 })
	first_name: string;

	@Column({ type: 'varchar', length: 255 })
	last_name: string;

	@Column({ type: 'varchar', length: 255, unique: true })
	email: string;

	@Column({ type: 'varchar', length: 10, unique: true, nullable: true })
	phone: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	password: string;

	@Column({ type: 'timestamp', default: null, nullable: true })
	verify_at: Date;

	@Column({ type: 'int', default: 3 })
	id_role: number;

	@Column({ type: 'varchar', length: 255, default: null, nullable: true })
	token: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => Role, (role) => role.user)
	@JoinColumn({ name: 'id_role', referencedColumnName: 'id_role' })
	role: Role;

	@ManyToMany(() => Product, (product) => product.favorites, { onDelete: 'CASCADE' })
	@JoinTable({
		name: 'favorites',
		joinColumn: { name: 'id_user', referencedColumnName: 'id_user' },
		inverseJoinColumn: { name: 'id_product', referencedColumnName: 'id_product' },
	})
	product: Product[];

	// Mối quan hệ với bảng action_history
	@OneToMany(() => ActionHistory, (actionh) => actionh.users)
	actionh: ActionHistory[];
}
