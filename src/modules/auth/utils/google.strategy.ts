/* eslint-disable @typescript-eslint/no-unused-vars */
import * as dotenv from 'dotenv';
dotenv.config();
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: process.env.BASE_URL + '/api/auth/google/redirect',
			scope: ['profile', 'email'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		// console.log(accessToken);
		// console.log(refreshToken);
		// console.log(profile);
		const user = await this.authService.validateUserGoogle({
			email: profile.emails[0].value,
			first_name: profile.name.familyName,
			last_name: profile.name.givenName,
		});
	}
}
