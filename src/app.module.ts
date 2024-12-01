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
      // host: 'postgresql://ainura:HhrH4pqsg0ySh8u7QrnI9pFaUWXvNnFq@dpg-ct68t2l6l47c7381pc80-a.oregon-postgres.render.com/db_ce3j',
      // port: 5432,
      // username: 'ainura',
      // password: 'HhrH4pqsg0ySh8u7QrnI9pFaUWXvNnFq',
      // database: 'db_ce3j',
      url: 'postgresql://ainura:HhrH4pqsg0ySh8u7QrnI9pFaUWXvNnFq@dpg-ct68t2l6l47c7381pc80-a.oregon-postgres.render.com:5432/db_ce3j', // full URL
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false, // Optional but required in some cases to avoid issues with self-signed certificates
      },
    }),
    AuthModule,
    FarmerModule,
    BuyerModule,
    ProductModule,
    CategoriesModule,
  ],
})
export class AppModule {}
