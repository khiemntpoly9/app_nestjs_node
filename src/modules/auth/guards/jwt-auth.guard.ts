/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../role.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext) {
		return super.canActivate(context);
	}

	handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
		//
		if (err || !user) {
			throw err || new UnauthorizedException();
		}
		//
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
			context.getHandler(),
			context.getClass(),
		]);
		// Check xem cần role gì
		if (!requiredRoles || requiredRoles.length === 0) {
			return true;
		}
		if (requiredRoles && !this.checkRoles(user.role, requiredRoles)) {
			throw new UnauthorizedException('Bạn không có quyền truy cập!');
		}
		return user;
	}

	// Check role
	private checkRoles(userRoles: Role[], requiredRoles: Role[]): boolean {
		return requiredRoles.some((role) => userRoles.includes(role));
	}
}
