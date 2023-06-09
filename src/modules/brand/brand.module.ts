import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/db/entity/brand.entity';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

@Module({
	imports: [TypeOrmModule.forFeature([Brand])],
	controllers: [BrandController],
	providers: [BrandService],
})
export class BrandModule {}
