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
			const findEmailUser = await this.userRepository
				.createQueryBuilder('users')
				.leftJoinAndSelect('users.role', 'role')
				.select([
					'users.id_user',
					'users.last_name',
					'users.email',
					'users.password',
					'users.verify',
					'role.short_role',
				])
				.where('users.email = :email', { email })
				.getOne();
			return findEmailUser;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lưu tài khoản
	saveUser(user: userDto) {
		try {
			return this.userRepository.save(user);
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy token tài khoản
	async getTokenUser(id: number): Promise<any> {
		try {
			const getTokenUser = await this.userRepository
				.createQueryBuilder('users')
				.select(['users.token'])
				.where('users.id_user = :id', { id })
				.getOne();
			return getTokenUser;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lưu & refesh token tài khoản
	saveTokenUser(email: string, token: string | null) {
		try {
			const saveToken = this.userRepository
				.createQueryBuilder('users')
				.update(User)
				.set({ token: token })
				.where('email = :email', { email })
				.execute();
		} catch (error) {
			throw new Error(error);
		}
	}

	// Verify Accout
	verifyUser(email: string) {
		try {
			const verify = this.userRepository
				.createQueryBuilder('users')
				.update(User)
				.set({ verify: 1 })
				.where('email = :email', { email })
				.execute();
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lưu mật khẩu mới
	savePassUser(email: string, password: string, token: string | null) {
		try {
			const savePass = this.userRepository
				.createQueryBuilder('users')
				.update(User)
				.set({ password: password })
				.set({ token: token })
				.where('email = :email', { email })
				.execute();
		} catch (error) {
			throw new Error(error);
		}
	}
}
