/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/db/entity/user.entity';
import { authDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
	constructor(private userService: UserService, private readonly jwtService: JwtService) {}

	// Đăng ký
	async registerAuth(authDto: authDto): Promise<void> {
		try {
			const checkEmail = await this.userService.checkUserEmail(authDto.email);
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
			await this.userService.saveUser(user);
		} catch (error) {
			throw new Error(error);
		}
	}

	// Đăng nhập
	async loginAuth(auth: authDto): Promise<any> {
		try {
			const user = await this.userService.checkUserEmail(auth.email);
			if (!user) {
				throw new Error('Tài khoản không tồn tại!');
			}
			// So sánh mật khẩu
			const passwordMatches = await bcrypt.compare(auth.password, user.password);
			if (!passwordMatches) {
				throw new Error('Sai mật khẩu!');
			}
			const payload = { userId: user.id_user, role: user.role.short_role };
			return {
				access_token: await this.jwtService.signAsync(payload),
			};
		} catch (error) {
			throw new Error(error);
		}
	}

	// Đăng xuất
	async logoutAuth(): Promise<void> {
		try {
			console.log('Đăng xuất');
		} catch (error) {
			throw new Error(error);
		}
	}
}
