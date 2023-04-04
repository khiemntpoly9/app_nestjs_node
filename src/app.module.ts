import { Module } from '@nestjs/common';
// App Module sẽ tổng hợp Controller và Service
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ConnectDBModule } from './connectdb/connectdb.module';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, ConnectDBModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
