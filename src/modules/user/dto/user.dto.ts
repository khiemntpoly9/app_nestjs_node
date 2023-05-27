/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class userDto {
	@ApiProperty()
	id_user: number;

	@ApiProperty()
	first_name: string;

	@ApiProperty()
	last_name: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	phone: string;

	@ApiProperty()
	password: string;

	@ApiProperty()
	id_role: number;

	@ApiProperty()
	token: string;
}
