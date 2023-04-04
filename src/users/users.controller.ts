import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
	@Get()
	user() {
		console.log('Đây là users');
	}
}
