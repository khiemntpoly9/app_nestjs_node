import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller()
export class MailController {
	constructor(private mailService: MailService) {}

	@Get('testmail')
	sendmail(): void {
		return this.mailService.sendMail();
	}
}
