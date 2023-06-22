import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionHistory } from 'src/db/entity/action_history.entity';
import { Repository } from 'typeorm';
import { ActionType } from 'src/db/entity/action_history.entity';

@Injectable()
export class ManagerService {
	constructor(
		@InjectRepository(ActionHistory)
		private actionHistoryRepository: Repository<ActionHistory>,
	) {}

	// Tạo lịch sử hành động
	async createActionHistory(
		id_user: number,
		action_type: string,
		id_product: number,
		id_categories: number,
		content: string,
	): Promise<ActionHistory> {
		try {
			// Lấy hành động
			function getActionType(action_type: string): ActionType {
				switch (action_type) {
					case 'create':
						return ActionType.CREATE;
					case 'update':
						return ActionType.UPDATE;
					case 'delete':
						return ActionType.DELETE;
					default:
						return ActionType.CREATE;
				}
			}
			const actionHistory = new ActionHistory();
			actionHistory.id_user = id_user;
			actionHistory.action_type = getActionType(action_type);
			actionHistory.id_product = id_product;
			actionHistory.id_categories = id_categories;
			actionHistory.content = content || 'Không có nội dung';
			const saveActionHistory = await this.actionHistoryRepository.save(actionHistory);
			return saveActionHistory;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy lịch sử hành động theo user
	async getActionHistoryByUser(id_user: number): Promise<ActionHistory[]> {
		try {
			const actionHistory = await this.actionHistoryRepository
				.createQueryBuilder('action_history')
				.where('action_history.id_user = :id_user', { id_user: id_user })
				.getMany();
			return actionHistory;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy lịch sử hành động theo user có filter
	async getActionHistoryByUserFilter(id_user: number, action: string): Promise<ActionHistory[]> {
		try {
			const actionHistory = await this.actionHistoryRepository
				.createQueryBuilder('action_history')
				.where('action_history.id_user = :id_user', { id_user: id_user })
				.andWhere('action_history.action_type = :action', { action: action })
				.getMany();
			return actionHistory;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy lịch sử hành động theo sản phẩm
	async getActionHistoryByProduct(id_product: number): Promise<ActionHistory[]> {
		try {
			const actionHistory = await this.actionHistoryRepository
				.createQueryBuilder('action_history')
				.where('action_history.id_product = :id_product', { id_product: id_product })
				.getMany();
			return actionHistory;
		} catch (error) {
			throw new Error(error);
		}
	}
}
