/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class productDto {
	@ApiProperty({
		description: 'Tên sản phẩm',
	})
	name_prod: string;

	@ApiProperty()
	id_categories: number;

	@ApiProperty()
	brand_prod: number;

	@ApiProperty()
	detail_prod: string;

	@ApiProperty()
	price_prod: number;

	@ApiProperty()
	material_prod: number | null;

	@ApiProperty()
	style_prod: number | null;
}
