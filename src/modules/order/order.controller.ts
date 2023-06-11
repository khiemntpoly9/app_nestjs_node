/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Post,
	Query,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response, Request } from 'express';

interface User extends Request {
	user: {
		userId: number;
		email: string;
		role: string;
	};
}

@Controller('cart')
export class OrderController {
	constructor(private orderService: OrderService) {}

	// Thêm sản phẩm vào giỏ hàng
	@Roles(Role.User, Role.CTV, Role.QTV)
	@UseGuards(JwtAuthGuard)
	@Post()
	async addProductToCart(
		@Query('prod') idprod: number,
		@Query('quantity') quantity: number,
		@Res() res: Response,
		@Req() req: User,
	) {
		try {
			// Check có order nào trạng thái false
			// Nếu có thì update
			// Nếu không thì tạo mới
			const checkOrderFalse = await this.orderService.checkOrderFalse(req.user.userId);
			if (checkOrderFalse) {
				// update
				const updateCart = await this.orderService.updateCart(checkOrderFalse.id_order, idprod, quantity);
				return res.status(HttpStatus.OK).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công!' });
			}
			// create
			const addProductToCart = await this.orderService.addProductToCart(idprod, quantity, req.user.userId);
			return res.status(HttpStatus.OK).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Roles(Role.User, Role.CTV, Role.QTV)
	@UseGuards(JwtAuthGuard)
	@Get()
	async getCart(@Res() res: Response, @Req() req: User) {
		try {
			const getCart = await this.orderService.getCart(req.user.userId);
			return res.status(HttpStatus.OK).json(getCart);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
