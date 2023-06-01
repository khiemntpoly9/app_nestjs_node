// import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { join } from 'path';

@Module({
	imports: [
		MailerModule.forRoot({
			transport: {
				host: 'smtp.gmail.com',
				port: 465,
				secure: true,
				auth: {
					user: process.env.EMAIL,
					pass: process.env.PASSWORD,
				},
			},
			defaults: {
				from: '"GachaShop" <gachashopoly@gmail.com>',
			},
			preview: false,
			template: {
				dir: join(__dirname + '/templates'),
				adapter: new HandlebarsAdapter(),
				options: {
					strict: true,
				},
			},
		}),
	],
	controllers: [MailController],
	providers: [MailService],
	exports: [],
})
export class MailModule {}
