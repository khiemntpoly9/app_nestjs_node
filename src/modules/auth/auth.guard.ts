import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { jwtConstants } from './constants';
import { Role } from './role.enum';
// import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private jwtService: JwtService, // private userService: UserService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
			context.getHandler(),
			context.getClass(),
		]);
		// Check xem cần role gì
		if (!requiredRoles || requiredRoles.length === 0) {
			return true;
		}
		// Lấy cookies
		const request = context.switchToHttp().getRequest();
		const token = await request.cookies['access_token'];
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = await this.jwtService.verifyAsync(token.access_token, {
				secret: jwtConstants.secret,
			});
			return this.validateRoles(requiredRoles, payload.role);
		} catch {
			throw new UnauthorizedException();
		}
	}

	// Check role
	validateRoles(requiredRoles: Role[], userRoles: string) {
		return requiredRoles.some((role) => userRoles.includes(role));
	}
}
