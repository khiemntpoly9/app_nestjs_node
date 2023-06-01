import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { AuthGuard } from '../auth/auth.guard';

@Controller()
export class UserController {
	constructor(private userService: UserService) {}

	@Roles(Role.QTV, Role.CTV)
	@UseGuards(AuthGuard)
	@Get('admin')
	async testAdmin() {
		try {
			return 'Quyền Admin';
		} catch (error) {
			throw new Error(error);
		}
	}
}
