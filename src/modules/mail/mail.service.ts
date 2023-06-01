/* eslint-disable @typescript-eslint/no-empty-function */
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
			.then(() => {
				console.log('Gửi mail thành công!');
			})
			.catch((error) => {
				console.log(error);
			});
	}
}
