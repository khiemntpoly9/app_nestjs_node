/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Body,
	Controller,
	Res,
	HttpException,
	HttpStatus,
	Post,
	Req,
	Get,
	UseGuards,
	Query,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { authDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants, jwtVerify } from './constants';
import { GoogleStrategy } from './guards/google.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import * as moment from 'moment-timezone';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private userService: UserService,
		private jwtService: JwtService,
	) {}

	// Đăng ký
	@Post('register')
	async registerAuth(@Body() authDto: authDto, @Res() res: Response) {
		try {
			const register = await this.authService.registerAuth(authDto);
			return res.status(HttpStatus.OK).json({ message: 'Đăng ký thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Đăng nhập Passport
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() req: Request, @Res() res: Response) {
		try {
			const token = await this.authService.login(req.user);
			return res
				.status(HttpStatus.OK)
				.cookie('access_token', token, { httpOnly: true })
				.json({ message: 'Đăng nhập thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Đăng nhập
	/* 
	@Post('login/v1')
	async loginAuth(@Body() authDto: authDto, @Res() res: Response) {
		try {
			const login = await this.authService.loginAuth(authDto);
			return res
				.status(HttpStatus.OK)
				.cookie('access_token', login, { httpOnly: true })
				.json({ message: 'Đăng nhập thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	*/

	// Đăng xuất
	@Post('logout')
	async logoutAuth(@Res() res: Response, @Req() req: Request) {
		try {
			const token = req.cookies['access_token'];
			const payload = await this.jwtService.verifyAsync(token, {
				secret: jwtConstants.secret,
			});
			const logout = await this.authService.logoutAuth(payload.email);
			return res
				.status(HttpStatus.OK)
				.clearCookie('access_token', { sameSite: 'none', secure: true })
				.json({ message: 'Đăng xuất thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/* Google Auth */
	@Get('google/login')
	@UseGuards(GoogleStrategy)
	handleLogin() {
		return { message: 'Google Authencation' };
	}

	@Get('google/redirect')
	@UseGuards(GoogleStrategy)
	handleRedirect() {
		return { message: 'Google OK' };
	}

	/* Verify Account */
	@Get('verify-account')
	async verifyAccout(@Query('token') token: string, @Res() res: Response) {
		const payload = await this.jwtService.verifyAsync(token, {
			secret: jwtVerify.secret,
		});
		// Xử lý thời gian
		const expirationDate = new Date(payload.exp * 1000);
		const expirationTimeGMT7 = moment(expirationDate).tz('Asia/Ho_Chi_Minh').format();
		const currentTime = moment();
		const targetTime = moment(expirationTimeGMT7);
		// Check time
		if (!currentTime.isBefore(targetTime)) {
			throw new Error('Token đã hết hạn!');
		}
		// Update Verify Accout
		this.userService.verifyUser(payload.email);
		return res.status(HttpStatus.OK).json({ message: 'Xác thực tài khoản thành công!' });
	}
}
