/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class imagesDto {
	@ApiProperty()
	public_id: string;

	@ApiProperty()
	secure_url: string;
}
