/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { jwtConstants } from 'src/modules/auth/constants';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(private readonly userService: UserService, private jwtService: JwtService) {}
	async use(req: Request, res: Response, next: NextFunction) {
		const token = req?.cookies['access_token'];
		if (token) {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: jwtConstants.secret,
			});
			// Check Verify
			if (payload.verify == false) throw new UnauthorizedException('Bạn cần xác minh tài khoản!');
			// payload.userId
			const tokenUser = await this.userService.getTokenUser(payload.userId);
			if (tokenUser == null) throw new UnauthorizedException('Bạn cần đăng nhập!');
			// tokenUser.token
			if (token !== tokenUser.token) {
				const updateToken = { ...tokenUser.token, expiresIn: '6h' };
				res.cookie('access_token', updateToken.token, {
					httpOnly: true,
					expires: new Date(updateToken.expiresIn),
				});
				// throw new BadRequestException('Token không trùng khớp!');
			}
		}
		next();
	}
}
