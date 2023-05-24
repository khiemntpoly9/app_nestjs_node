import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
/** */
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    ProductModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '103.200.23.120',
      port: 3306,
      username: 'anthomep_khiemtnps16018',
      password: 'khiem1412fptz',
      database: 'anthomep_gachashop',
      entities: ['entity/*.js'],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
