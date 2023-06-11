import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from 'src/db/entity/order.entity';
import { OrderItem } from 'src/db/entity/order_item.entity';
import { Product } from 'src/db/entity/product.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Order, OrderItem, Product])],
	controllers: [OrderController],
	providers: [OrderService],
})
export class OrderModule {}
