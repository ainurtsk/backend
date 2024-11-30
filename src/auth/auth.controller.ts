import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterFarmerDto } from './dto/register-farmer.dto';
import { RegisterBuyerDto } from './dto/register-buyer.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // @Post('register/farmer')
  // registerFarmer(@Body() registerFarmerDto: RegisterFarmerDto) {
  //   return this.authService.registerFarmer(registerFarmerDto);
  // }
  //
  // @Post('register/buyer')
  // async registerBuyer(@Body() registerBuyerDto: RegisterBuyerDto) {
  //   return this.authService.registerBuyer(registerBuyerDto);
  // }
  @Post('register')
  async register(
    @Body() body: { userType: 'farmer' | 'buyer'; [key: string]: any },
  ) {
    const { userType, ...data } = body; // Separate userType from other fields

    if (userType === 'farmer') {
      // Validate and register a farmer
      const farmerData: RegisterFarmerDto = {
        farmer_name: data.farmer_name,
        farmer_surname: data.farmer_surname,
        farmer_email: data.farmer_email,
        phone_number: data.phone_number,
        farm_location: data.farm_location,
        password: data.password,
      };
      return this.authService.registerFarmer(farmerData);
    } else if (userType === 'buyer') {
      // Validate and register a buyer
      const buyerData: RegisterBuyerDto = {
        buyer_name: data.buyer_name,
        buyer_surname: data.buyer_surname,
        email: data.email,
        phone_number: data.phone_number,
        address: data.address,
        password: data.password,
      };
      return this.authService.registerBuyer(buyerData);
    } else {
      throw new Error('Invalid user type');
    }
  }
  // @Post('login')
  // login(
  //   @Body() loginDto: LoginDto,
  //   @Query('userType') userType: 'farmer' | 'buyer',
  // ) {
  //   return this.authService.login(loginDto, userType);
  // }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
