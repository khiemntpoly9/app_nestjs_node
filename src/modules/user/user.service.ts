/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/db/entity/user.entity';
import { Repository } from 'typeorm';
import { userDto } from './dto/user.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private readonly jwtService: JwtService,
	) {}

	// Lấy thông tin tài khoản
	async getProfileUser(email: string): Promise<User> {
		try {
			const profile = await this.userRepository
				.createQueryBuilder('users')
				.select([
					'users.id_user',
					'users.first_name',
					'users.last_name',
					'users.email',
					'users.phone',
					'users.createdAt',
				])
				.where('users.email = :email', { email })
				.getOne();
			return profile;
		} catch (error) {
			throw new Error(error);
		}
	}

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
					'users.verify_at',
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

	// Register User Google
	async registerUser(user: { email: string; firstName: string; lastName: string }) {
		const regUser = await this.userRepository
			.createQueryBuilder('users')
			.insert()
			.into(User)
			.values({
				first_name: user.firstName,
				last_name: user.lastName,
				email: user.email,
				phone: null,
				password: null,
				verify_at: 1,
			})
			.execute();
		return regUser;
	}

	// Sửa thông tin tài khoản
	async updateUser(id: number, data: userDto): Promise<any> {
		try {
			const updateUser = await this.userRepository
				.createQueryBuilder('users')
				.update(User)
				.set({
					first_name: data.first_name,
					last_name: data.last_name,
					phone: data.phone,
				})
				.where('users.id_user = :id', { id })
				.execute();
			return updateUser;
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

	// Verify Account
	async verifyUser(email: string): Promise<void> {
		try {
			const currentTimeStamp = new Date().getTime();
			await this.userRepository
				.createQueryBuilder('users')
				.update(User)
				.set({ verify_at: currentTimeStamp })
				.where('email = :email', { email })
				.execute();
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lưu mật khẩu mới
	async savePassUser(email: string, password: string, token: string | null): Promise<void> {
		try {
			await this.userRepository
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

	// Xoá tài khoản
	async deleteUser(id: number): Promise<void> {
		try {
			// Xoá tài khoản
			await this.userRepository
				.createQueryBuilder('users')
				.delete()
				.from(User)
				.where('id_user = :id', { id })
				.execute();
		} catch (error) {
			throw new Error(error);
		}
	}

	// Đổi role tài khoản
	async changeRoleUser(id: number, role: number): Promise<void> {
		try {
			const changeRole = await this.userRepository
				.createQueryBuilder('users')
				.update(User)
				.set({ id_role: role })
				.where('id_user = :id', { id })
				.returning(['id_user', 'email', 'id_role', 'verify'])
				.execute();
			// Lấy data sau khi update
			const updateUser = changeRole.raw[0];
			const payload = {
				userId: updateUser.id_user,
				email: updateUser.email,
				role: updateUser.id_role,
				verify: updateUser.verify,
			};
			// Tạo token
			const token = this.jwtService.sign(payload);
			// Lưu token
			await this.userRepository
				.createQueryBuilder('users')
				.update(User)
				.set({ token: token })
				.where('id_user = :id', { id })
				.execute();
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy danh sách tài khoản
	async getListUser(): Promise<User[]> {
		try {
			const listUser = await this.userRepository
				.createQueryBuilder('users')
				.leftJoinAndSelect('users.role', 'role')
				.select([
					'users.id_user',
					'users.first_name',
					'users.last_name',
					'users.email',
					'users.phone',
					'users.verify_at',
					'role.name_role',
					'users.createdAt',
				])
				.getMany();
			return listUser;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy danh sách tài khoản theo role
	async getListUserByRole(role: string): Promise<User[]> {
		try {
			const listUser = await this.userRepository
				.createQueryBuilder('users')
				.leftJoinAndSelect('users.role', 'role')
				.select([
					'users.id_user',
					'users.first_name',
					'users.last_name',
					'users.email',
					'users.phone',
					'users.createdAt',
				])
				.where('role.short_role = :role', { role })
				.getMany();
			return listUser;
		} catch (error) {
			throw new Error(error);
		}
	}
}
