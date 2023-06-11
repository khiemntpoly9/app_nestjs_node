/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/db/entity/order.entity';
import { Repository } from 'typeorm';
import { orderDto } from './dto/order.dto';
import { OrderItem } from 'src/db/entity/order_item.entity';
import { Product } from 'src/db/entity/product.entity';

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(Order)
		private orderRepository: Repository<Order>,
		@InjectRepository(OrderItem)
		private orderitemRepository: Repository<OrderItem>,
		@InjectRepository(Product)
		private productRepository: Repository<Product>,
	) {}

	// Check xem có order nào trạng thái false theo user
	async checkOrderFalse(id_user: number): Promise<Order> {
		try {
			const checkOrderFalse = await this.orderRepository.findOne({
				where: { id_user, status: 0 },
			});
			return checkOrderFalse;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Update giỏ hàng
	async updateCart(id_order: number, id_product: number, quantity: number): Promise<OrderItem> {
		try {
			// Check xem sản phẩm đã có trong giỏ hàng chưa
			const checkProductInCart = await this.orderitemRepository.findOne({
				where: { id_order, id_product },
			});
			if (checkProductInCart) {
				// Update
				const updateCart = await this.orderitemRepository.update(
					{ id_order, id_product },
					{ quantity: quantity },
				);
			}
			// Lấy giá sản phẩm
			const product = await this.productRepository.findOne({ where: { id_product } });
			// Tính tổng tiền
			const total = product.price_prod * quantity;
			// Update
			const cart = new OrderItem();
			cart.id_order = id_order;
			cart.id_product = id_product;
			cart.quantity = quantity;
			cart.price = total;
			// save
			const saveCart = await this.orderitemRepository.save(cart);
			return saveCart;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Áp dụng lần đầu tạo order
	// Thêm sản phẩm vào giỏ hàng
	async addProductToCart(id_product: number, quantity: number, id_user: number): Promise<Order> {
		try {
			const cart = new Order();
			cart.id_user = id_user;
			cart.total = 0;
			cart.status = 0;
			// save
			const saveOrder = await this.orderRepository.save(cart);
			// Thêm sản phẩm vào OrderItem
			// Lấy giá sản phẩm
			const product = await this.productRepository.findOne({ where: { id_product } });
			// Tính tổng tiền
			const total = product.price_prod * quantity;
			// Update OrderItem
			const cartItem = new OrderItem();
			cartItem.id_order = saveOrder.id_order;
			cartItem.id_product = id_product;
			cartItem.quantity = quantity;
			cartItem.price = total;
			// save
			const saveOrderItem = await this.orderitemRepository.save(cartItem);
			// Cập nhật total trong order
			this.totalOrderItem(saveOrder.id_order);
			return saveOrder;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Tính tổng total của các item có cùng id_order
	async totalOrderItem(id_order: number) {
		try {
			const total = await this.orderitemRepository.find({ where: { id_order } });
			// Tính tổng tiền trong mảng
			let totalMoney = 0;
			total.forEach((item) => {
				totalMoney += item.price;
			});
			// Cập nhật total trong order
			const order = await this.orderRepository.findOne({ where: { id_order } });
			order.total = totalMoney;
			await this.orderRepository.save(order);
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy giỏ hàng theo user
	async getCart(id_user: number): Promise<Order> {
		try {
			const cart = await this.orderRepository
				.createQueryBuilder('orders')
				.leftJoinAndSelect('orders.order_items', 'orderItem')
				.leftJoinAndSelect('orderItem.product', 'product')
				.where('orders.id_user = :id_user', { id_user })
				.andWhere('orders.status = :status', { status: 0 })
				.select([
					'orders.id_order',
					'orders.id_user',
					'orders.total',
					'orderItem.id_order_item',
					'orderItem.quantity',
					'orderItem.price',
					'product.name_prod',
					'product.price_prod',
					'product.img_thumbnail',
				])
				.getOne();
			return cart;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy đơn hàng đã thanh toán
	async getCartPaid(id_user: number): Promise<Order[]> {
		try {
			const orders = await this.orderRepository
				.createQueryBuilder('orders')
				.leftJoinAndSelect('orders.order_items', 'orderItem')
				.leftJoinAndSelect('orderItem.product', 'product')
				.where('orders.id_user = :id_user', { id_user })
				.andWhere('orders.status = :status', { status: 1 })
				.select([
					'orders.id_order',
					'orders.id_user',
					'orders.total',
					'orderItem.id_order_item',
					'orderItem.quantity',
					'orderItem.price',
					'product.name_prod',
					'product.price_prod',
					'product.img_thumbnail',
				])
				.getMany();
			return orders;
		} catch (error) {
			throw new Error(error);
		}
	}
}
