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
	Query,
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
	@Roles(Role.User, Role.CTV, Role.QTV)
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

	// Lấy danh sách tài khoản
	@Roles(Role.QTV)
	@UseGuards(JwtAuthGuard)
	@Get('list')
	async listUser(@Res() res: Response) {
		try {
			const listUser = await this.userService.getListUser();
			return res.status(HttpStatus.OK).json(listUser);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Lấy danh sách tài khoản theo role
	@Roles(Role.QTV)
	@UseGuards(JwtAuthGuard)
	@Get('list-role')
	async listUserByRole(@Query('role') role: string, @Res() res: Response) {
		try {
			const listUser = await this.userService.getListUserByRole(role);
			return res.status(HttpStatus.OK).json(listUser);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Đổi role tài khoản
	@Roles(Role.QTV)
	@UseGuards(JwtAuthGuard)
	@Patch('change-role')
	async changeRole(@Body() user: userDto, @Res() res: Response) {
		try {
			const changeRole = await this.userService.changeRoleUser(user.id_user, user.id_role);
			// Đổi role, cập nhật token
			return res.status(HttpStatus.OK).json({ message: 'Đổi role thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
