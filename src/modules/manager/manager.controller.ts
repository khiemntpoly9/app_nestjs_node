import { Controller, Get, HttpException, HttpStatus, Query, Res, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ManagerService } from './manager.service';
import { Response } from 'express';

@Controller('manager')
export class ManagerController {
	constructor(private managerService: ManagerService) {}

	// Lấy lịch sử theo user
	@Roles(Role.QTV)
	@UseGuards(JwtAuthGuard)
	@Get('history-user')
	async getActionHistoryByUser(@Query('id') id: number, @Res() res: Response) {
		try {
			const data = await this.managerService.getActionHistoryByUser(id);
			return res.status(HttpStatus.OK).json(data);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Lấy lịch sử theo product
	@Roles(Role.QTV)
	@UseGuards(JwtAuthGuard)
	@Get('history-product')
	async getActionHistoryByProduct(@Query('id') id: number, @Res() res: Response) {
		try {
			const data = await this.managerService.getActionHistoryByProduct(id);
			return res.status(HttpStatus.OK).json(data);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
