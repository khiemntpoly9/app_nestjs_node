/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entity/user.entity';
import { Repository } from 'typeorm';
import { userDto } from './dto/user.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	// Check tài khoản có tồn tại
	async checkUserEmail(email: string): Promise<User> {
		try {
			const findEmailUser = await this.userRepository.findOne({
				where: {
					email: email,
				},
			});
			return findEmailUser;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lưu tài khoản
	async saveUser(user: userDto): Promise<void> {
		try {
			await this.userRepository.save(user);
		} catch (error) {
			throw new Error(error);
		}
	}
}
