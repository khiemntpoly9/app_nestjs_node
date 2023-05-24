/* eslint-disable prettier/prettier */
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class DeltailProd {
  @PrimaryColumn({ type: 'int' })
  product_id: number;

  @PrimaryColumn({ type: 'int' })
  color_id: number;
}
