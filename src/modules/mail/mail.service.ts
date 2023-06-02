/* eslint-disable @typescript-eslint/no-empty-function */
import * as dotenv from 'dotenv';
dotenv.config();
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) {}
	sendMail(): void {
		this.mailerService
			.sendMail({
				to: 'trungkhiem1412@gmail.com',
				subject: 'Test gửi mail thôi!',
				template: 'welcome',
				context: {
					username: 'Trung Khiêm',
				},
			})
			.then(() => {})
			.catch((error) => {
				console.log(error);
			});
	}

	// Send mail verify
	sendMailVerify(email: string, last_name: string, verify_token: string): void {
		this.mailerService
			.sendMail({
				to: email,
				subject: 'Xác thực tài khoản GachaShop',
				template: 'verify',
				context: {
					last_name: last_name,
					link_verify: process.env.BASE_URL + `/api/auth/verify-account?token=${verify_token}`,
				},
			})
			.then(() => {})
			.catch((error) => {
				console.log(error);
			});
	}

	// Send mail recovery password
	sendMailRecoveryPass(email: string, last_name: string, verify_token: string): void {
		this.mailerService
			.sendMail({
				to: email,
				subject: 'Khôi phục mật khẩu tài khoản GachaShop',
				template: 'recoverypass',
				context: {
					last_name: last_name,
					link_verify: process.env.BASE_URL + `/api/auth/verify-account?token=${verify_token}`,
				},
			})
			.then(() => {})
			.catch((error) => {
				console.log(error);
			});
	}
}
