import {
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Controller,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Param, Req, UseGuards } from '@nestjs/common/decorators';
import { Request } from 'express';
import { BrandService } from './brand.service';
import { BrandDto } from './dto/brand.dto';
import { BrandEntity } from './brand.entity';
import { BrandUpdateIdDto } from './dto/updateId.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { User } from '../shared/user.decorator';
import { ImageDto } from '../shared/dto/image.dto';
import { DeleteIdDto } from '../shared/dto/delete-id.dto';

const storage = diskStorage({
  destination: './images/brand-image',
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

@ApiBearerAuth()
@ApiTags('brand')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  // Create Section
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @User('id') id: number,
    @Body() brandData: BrandDto
  ): Promise<{ msg; data; status }> {
    const data = await this.brandService.create(brandData, id);
    return { msg: 'Brand Created Successfully', data: data, status: 'success' };
  }

  //   Get All brand
  @Get('all')
  async findAll(): Promise<{ msg; data; status }> {
    const data = await this.brandService.findAll();
    return { msg: 'Get Brand Successfully', data, status: 'success' };
  }

  @Get('single/:id')
  async BrandById(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.brandService.findBrandById(id);
    return { msg: 'Get Category Successfully', data, status: 'success' };
  }

  //Get By User_id
  @Get('user')
  async ByUser(@User('id') vendor_id: number): Promise<{ msg; data; status }> {
    const data = await this.brandService.ByUser(vendor_id);
    return { msg: 'Get Brand Successfully', data, status: 'success' };
  }

  // Update Section Id
  @UsePipes(new ValidationPipe())
  @Post('update')
  async updateId(
    @Body() brandData: BrandUpdateIdDto
  ): Promise<{ msg; data; status }> {
    const data = await this.brandService.updateId(brandData);
    return { msg: 'Brand Updated Successfully', data, status: 'success' };
  }

  // Delete Section id
  @UsePipes(new ValidationPipe())
  @Post('delete')
  async deleteId(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.brandService.deleteId(id);
    return { msg: 'Brand Deleted Successfully', data, status: 'success' };
  }

  //generate Image url
  @UsePipes(new ValidationPipe())
  @Post('imageurl')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage }))
  async CreateImageUrl(
    @Body() data: ImageDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req: Request
  ): Promise<{ msg; data; status }> {
    const imageURL = `${req.protocol}://${req.get('Host')}/brand-image/${
      image.filename
    }`;

    return {
      msg: 'Brand Image Uploaded Successfully',
      data: imageURL,
      status: 'success',
    };
  }
}
