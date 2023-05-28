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
			const findEmailUser = this.userRepository
				.createQueryBuilder('users')
				.leftJoinAndSelect('users.role', 'role')
				.select(['users.id_user', 'users.password', 'role.short_role'])
				.where('users.email = :email', { email });
			const result = await findEmailUser.getOne();
			return result;
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

	// Lấy token tài khoản
	async getTokenUser(id: number): Promise<any> {
		try {
			const getTokenUser = this.userRepository
				.createQueryBuilder('users')
				.select(['users.token'])
				.where('users.id_user = :id', { id });
		} catch (error) {
			throw new Error(error);
		}
	}
}
