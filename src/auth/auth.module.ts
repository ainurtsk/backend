import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Farmer } from '../farmer/farmer.entity'; // Import Farmer entity
import { Buyer } from '../buyer/buyer.entity'; // Import Buyer entity
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Farmer, Buyer]), // Register Farmer and Buyer entities
    JwtModule.register({
      secret: 'IbbAlT5FksEA0pvbLdz7Fg3DyUf6DdT6', // Replace with a secure key (use ENV variables in production)
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
