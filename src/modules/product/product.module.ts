/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { productService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [productService],
})
export class ProductModule {}
