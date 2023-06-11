import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

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

	@Column({ type: 'text', nullable: false })
	content: string;

	@Column({ type: 'int', nullable: false })
	id_product: number;

	@CreateDateColumn({ type: 'timestamp', nullable: false })
	action_date: Date;
}
