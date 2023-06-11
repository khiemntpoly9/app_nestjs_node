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
		content: string,
		id_product: number,
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
			actionHistory.content = content || 'Không có nội dung';
			actionHistory.id_product = id_product;
			const saveActionHistory = await this.actionHistoryRepository.save(actionHistory);
			return saveActionHistory;
		} catch (error) {
			throw new Error(error);
		}
	}
}
