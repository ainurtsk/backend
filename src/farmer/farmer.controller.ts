import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FarmerService } from './farmer.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Farmer } from './farmer.entity';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('farmers')
export class FarmerController {
  constructor(private readonly farmerService: FarmerService) {}

  @Get()
  async findAll(): Promise<Farmer[]> {
    return this.farmerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Farmer> {
    return this.farmerService.findOne(id);
  }

  @Post()
  async create(@Body() farmer: Partial<Farmer>): Promise<Farmer> {
    return this.farmerService.create(farmer);
  }

  @Patch('/profile/:id')
  @UseInterceptors(
    FileInterceptor('profile_image', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `avatar-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: number,
    @Body() updateData: UpdateFarmerDto,
    @UploadedFile() profile_image?: Express.Multer.File,
  ): Promise<Farmer> {
    const imagePath = profile_image?.path || null;
    return this.farmerService.update(id, updateData, imagePath);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.farmerService.delete(id);
  }
}
