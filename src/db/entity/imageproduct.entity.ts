/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'img_product' })
export class ImgProduct {
	@PrimaryGeneratedColumn({ type: 'int' })
	id_images: number;

	// N - 1 => Product
	@Column({ type: 'int' })
	id_product: number;
	@ManyToOne(() => Product, (product) => product.img_prod, {
		cascade: ['remove'],
	})
	@JoinColumn({ name: 'id_product', referencedColumnName: 'id_product' })
	product: Product;

	@Column({ type: 'varchar', length: 255 })
	public_id: string;

	@Column({ type: 'varchar', length: 255 })
	url: string;

	@CreateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
	})
	createdAt: Date;
}
