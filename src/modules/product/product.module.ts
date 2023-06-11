/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from 'src/db/entity/product.entity';
import { DeltailProd } from 'src/db/entity/detail_prod.entity';
import { ImgProduct } from 'src/db/entity/imageproduct.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ManagerService } from '../manager/manager.service';
import { ActionHistory } from 'src/db/entity/action_history.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Product, DeltailProd, ImgProduct, ActionHistory])],
	controllers: [ProductController],
	providers: [ProductService, ManagerService, CloudinaryService],
})
export class ProductModule {}
