import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Farmer } from '../farmer/farmer.entity';
import { Buyer } from '../buyer/buyer.entity';
import { RegisterFarmerDto } from './dto/register-farmer.dto';
import { RegisterBuyerDto } from './dto/register-buyer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Farmer)
    private farmerRepository: Repository<Farmer>,
    @InjectRepository(Buyer)
    private buyerRepository: Repository<Buyer>,

    private readonly jwtService: JwtService,
  ) {}

  async registerFarmer(registerFarmerDto: RegisterFarmerDto): Promise<Farmer> {
    const { farmer_email, password } = registerFarmerDto;

    // Check if the email is already registered
    const existingFarmer = await this.farmerRepository.findOneBy({
      farmer_email,
    });
    if (existingFarmer) {
      throw new ConflictException('Farmer with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the farmer
    const farmer = this.farmerRepository.create({
      ...registerFarmerDto,
      password: hashedPassword,
    });

    return this.farmerRepository.save(farmer);
  }
  async registerBuyer(registerBuyerDto: RegisterBuyerDto): Promise<Buyer> {
    const { email, password } = registerBuyerDto;

    // Check if the email is already registered
    const existingBuyer = await this.buyerRepository.findOneBy({ email });
    if (existingBuyer) {
      throw new ConflictException('Buyer with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the buyer
    const buyer = this.buyerRepository.create({
      ...registerBuyerDto,
      password: hashedPassword,
    });

    return this.buyerRepository.save(buyer);
  }

  //async login(loginDto: LoginDto, userType: 'farmer' | 'buyer') {
  async login(loginDto: LoginDto) {
    const { email, password, userType } = loginDto;

    let user: Farmer | Buyer | null;
    if (userType === 'farmer') {
      user = await this.farmerRepository.findOneBy({ farmer_email: email });
    } else if (userType === 'buyer') {
      user = await this.buyerRepository.findOneBy({ email });
    } else {
      throw new UnauthorizedException('Invalid user type');
    }

    // Check if user exists
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate a JWT token
    const payload = {
      id:
        userType === 'farmer'
          ? (user as Farmer).farmer_id
          : (user as Buyer).buyer_id,
      email:
        userType === 'farmer'
          ? (user as Farmer).farmer_email
          : (user as Buyer).email,
      role: userType,
    };
    const token = this.jwtService.sign(payload);

    return { accessToken: token, id: payload.id, role: userType };
  }
}
