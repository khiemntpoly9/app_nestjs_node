/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class orderDto {
	@ApiProperty()
	id_product: number;

	@ApiProperty()
	quantity: number;
}
