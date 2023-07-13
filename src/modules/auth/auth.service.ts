/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/db/entity/user.entity';
import { authDto, authDtoGG } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { jwtVerify } from './constants';
import { MailService } from '../mail/mail.service';

const saltOrRounds = 10;
@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private readonly jwtService: JwtService,
		private mailService: MailService,
	) {}

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
			user.verify_at = null;
			// Save User
			const newUser = await this.userService.saveUser(user);
			/*
			newUser.id_user
			newUser.email
			timeExpires
			*/
			const newUserToken = {
				userId: newUser.id_user,
				email: newUser.email,
			};
			// Verify token
			const verify_token = await this.jwtService.signAsync(newUserToken, {
				secret: jwtVerify.secret,
				expiresIn: '24h',
			});
			// Gửi Email
			this.mailService.sendMailVerify(newUser.email, newUser.last_name, verify_token);
			// End
		} catch (error) {
			throw new Error(error);
		}
	}

	// Đăng nhập
	/*
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
			const payload = { userId: user.id_user, email: user.email, role: user.role.short_role };
			const access_token = await this.jwtService.signAsync(payload);
			// Lưu token vào db user
			const saveToken = this.userService.saveTokenUser(auth.email, access_token);
			return access_token;
		} catch (error) {
			throw new Error(error);
		}
	}
	*/

	// Đăng nhập Passport
	async login(user: any) {
		const payload = {
			userId: user.id_user,
			email: user.email,
			role: user.role.short_role,
			verify_at: user.verify_at,
		};
		const access_token = await this.jwtService.signAsync(payload);
		// Lưu token vào db user
		this.userService.saveTokenUser(user.email, access_token);
		return access_token;
	}

	// Validate User Local
	async validateUserLocal(email: string, pass: string): Promise<any> {
		const user = await this.userService.checkUserEmail(email);
		if (!user) {
			throw new Error('Tài khoản không tồn tại!');
		}
		// So sánh mật khẩu
		const passwordMatches = await bcrypt.compare(pass, user.password);
		// User, Pass true
		if (user && passwordMatches) {
			const { password, ...result } = user;
			return result;
		} else {
			throw new Error('Sai mật khẩu!');
		}
	}

	// Xác thực đăng nhập Google
	async googleLogin(req: {
		user: { email: string; firstName: string; lastName: string; accessToken: string; refreshToken: string };
	}): Promise<string> {
		if (!req.user) {
			throw new Error('No user from google!');
		}
		// Kiểm tra user
		const user = await this.userService.checkUserEmail(req.user.email);
		if (!user) {
			// Đăng ký nhanh cho user chưa tồn tại
			const user = await this.userService.registerUser(req.user);
		}
		// Token
		const payload = {
			userId: user.id_user,
			email: user.email,
			role: user.role.short_role,
			verify: user.verify_at,
		};
		const access_token = await this.jwtService.signAsync(payload);
		// Lưu token vào db user
		const saveToken = this.userService.saveTokenUser(user.email, access_token);
		// Trả về token
		return access_token;
	}

	// Đăng xuất
	async logoutAuth(email: string) {
		try {
			// refesh token user
			const refeshToken = this.userService.saveTokenUser(email, null);
		} catch (error) {
			throw new Error(error);
		}
	}
}
