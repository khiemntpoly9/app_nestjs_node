/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class authDto {
	@ApiProperty()
	first_name: string;

	@ApiProperty()
	last_name: string;

	@ApiProperty()
	phone: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	password: string;
}
