import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { FarmerModule } from './farmer/farmer.module';
import { BuyerModule } from './buyer/buyer.module';
import { ProductModule } from './product/product.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  controllers: [AppController],
  providers: [AppService],

  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '2317',
      database: 'project_swe',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    FarmerModule,
    BuyerModule,
    ProductModule,
    CategoriesModule,
  ],
})
export class AppModule {}
