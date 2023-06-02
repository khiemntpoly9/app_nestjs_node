import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
export class UserController {
	constructor(private userService: UserService) {}

	@Roles(Role.CTV, Role.QTV)
	@UseGuards(JwtAuthGuard)
	@Get('admin')
	async testAdmin(@Req() req: Request) {
		try {
			console.log(req.user);
			return req.user;
		} catch (error) {
			throw new Error(error);
		}
	}
}
