/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/db/entity/user.entity';
import { authDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private UserService: UserService,
	) {}

	async registerAuth(authDto: authDto): Promise<void> {
		try {
			const checkEmail = await this.UserService.checkUserEmail(authDto.email);
			if (checkEmail) {
				throw new Error('Tài khoản đã tồn tại!');
			}
			// Mã hoá mật khẩu
			const salt = await bcrypt.genSalt(saltOrRounds);
			const hashedPassword = await bcrypt.hash(authDto.password, salt);

			// User
			const user = new User();
			user.first_name = authDto.first_name;
			user.last_name = authDto.last_name;
			user.phone = authDto.phone;
			user.email = authDto.email;
			user.password = hashedPassword;
			// Save User
			await this.UserService.saveUser(user);
		} catch (error) {
			throw new Error(error);
		}
	}
}
