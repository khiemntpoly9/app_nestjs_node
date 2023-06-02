/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Res, HttpException, HttpStatus, Post, Req, Get, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { authDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { GoogleStrategy } from './guards/google.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService, private jwtService: JwtService) {}

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

	//Đăng nhập Passport
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
}
