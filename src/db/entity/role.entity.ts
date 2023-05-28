/* eslint-disable prettier/prettier */
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn,
	OneToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity('role')
export class Role {
	@PrimaryGeneratedColumn({ type: 'int' })
	id_role: number;

	@Column({ type: 'varchar', length: 50 })
	name_role: number;

	@Column({ type: 'varchar', length: 20 })
	short_role: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(() => User, (user) => user.role)
	@JoinColumn({ name: 'id_role', referencedColumnName: 'id_role' })
	user: User[];
}
