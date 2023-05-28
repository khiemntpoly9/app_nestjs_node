/* eslint-disable prettier/prettier */
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn,
	ManyToOne,
} from 'typeorm';
import { Role } from './role.entity';

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

	@Column({ type: 'varchar', length: 10, unique: true })
	phone: string;

	@Column({ type: 'varchar', length: 255 })
	password: string;

	@Column({ type: 'int', default: 3 })
	id_role: number;

	@Column({ type: 'varchar', length: 255, default: null })
	token: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => Role, (role) => role.user)
	@JoinColumn({ name: 'id_role', referencedColumnName: 'id_role' })
	role: Role;
}
