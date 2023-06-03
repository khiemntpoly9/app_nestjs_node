/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Controller,
	Get,
	UseGuards,
	Req,
	HttpException,
	HttpStatus,
	Post,
	Body,
	Res,
	Patch,
} from '@nestjs/common';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { Response } from 'express';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { userDto } from './dto/user.dto';

interface User extends Request {
	user: {
		userId: number;
		email: string;
		role: string;
	};
}

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	// Lấy thông tin tài khoản
	@Roles(Role.User, Role.CTV, Role.QTV)
	@UseGuards(JwtAuthGuard)
	@Get('profile')
	async proficeUser(@Req() req: User) {
		try {
			const profileUser = await this.userService.getProfileUser(req.user.email);
			return profileUser;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Sửa thông tin tài khoản
	@Roles(Role.User, Role.CTV, Role.QTV)
	@UseGuards(JwtAuthGuard)
	@Patch('update')
	async updateUser(@Body() user: userDto, @Res() res: Response, @Req() req: User) {
		try {
			// Lấy data mới
			const update = await this.userService.updateUser(req.user.userId, user);
			return res.status(HttpStatus.OK).json({ message: 'Cập nhật tài khoản thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Xoá tài khoản
	@Roles(Role.User)
	@UseGuards(JwtAuthGuard)
	@Post('delete')
	async deleteUser(@Body() password: string, @Res() res: Response, @Req() req: User) {
		try {
			// Lấy dữ liệu user
			const user = await this.userService.checkUserEmail(req.user.email);
			// Check mật khẩu
			const passwordMatches = await bcrypt.compare(password, user.password);
			if (!passwordMatches) throw new Error('Mật khẩu không trùng khớp!');
			// Xoá tài khoản
			const deleteUser = this.userService.deleteUser(req.user.userId);
			return res.status(HttpStatus.OK).json({ message: 'Xoá tài khoản thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Test
	@Roles(Role.CTV, Role.QTV)
	@UseGuards(JwtAuthGuard)
	@Get('admin')
	async testAdmin(@Req() req: Request) {
		try {
			console.log(req.user);
			return req.user;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
