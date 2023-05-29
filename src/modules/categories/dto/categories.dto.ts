/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class categoryDto {
	@ApiProperty()
	name_categories: string;

	@ApiProperty()
	parent_id: number | null;
}
