/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'favorites' })
export class Favorites {
	@PrimaryGeneratedColumn({ type: 'int' })
	id_favorites: number;

	@Column({ type: 'int', nullable: false })
	id_user: number;

	@Column({ type: 'int', nullable: false })
	id_product: number;

	// many to many product
	@ManyToOne(() => Product, (product) => product.favorites)
	@JoinColumn({ name: 'id_product', referencedColumnName: 'id_product' })
	product: Product;
}
