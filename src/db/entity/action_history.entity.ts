import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum ActionType {
	'CREATE' = 'create',
	'UPDATE' = 'update',
	'DELETE' = 'delete',
}

export enum Type {
	'PRODUCT' = 'product',
	'CATEGORY' = 'category',
}
@Entity({ name: 'action_history' })
export class ActionHistory {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id_history: number;

	@Column({ type: 'int', nullable: false })
	id_user: number;

	@Column({ type: 'enum', enum: ActionType, default: ActionType.CREATE, nullable: false })
	action_type: ActionType;

	@Column({ type: 'enum', enum: Type, default: null, nullable: false })
	type: Type;

	@Column({ type: 'int', nullable: false })
	id: number;

	@Column({ type: 'text', nullable: false })
	content: string;

	@CreateDateColumn({ type: 'timestamp', nullable: false })
	action_date: Date;
}
