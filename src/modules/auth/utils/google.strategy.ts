/* eslint-disable @typescript-eslint/no-unused-vars */
import * as dotenv from 'dotenv';
dotenv.config();
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { VerifiedCallback } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: process.env.BASE_URL + '/api/auth/google/redirect',
			scope: ['profile', 'email'],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: VerifiedCallback,
	): Promise<any> {
		try {
			const { name, emails } = profile;
			const user = {
				email: emails[0].value,
				firstName: name.givenName,
				lastName: name.familyName,
				accessToken,
				refreshToken,
			};
			done(null, user);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
