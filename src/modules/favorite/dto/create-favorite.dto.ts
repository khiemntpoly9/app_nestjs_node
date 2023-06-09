import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
	@ApiProperty()
	id_product: number;
}
