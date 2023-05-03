import {
  Get,
  Post,
  Body,
  Param,
  Controller,
  UsePipes,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { RegionCreateDto } from './dto/create.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RegionUpdateDto } from './dto/update.dto';
import { ImageDto } from '../shared/dto/image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../shared/user.decorator';

const storage = diskStorage({
  destination: './images/region-image',
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

@ApiBearerAuth()
@ApiTags('region')
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  // Create Section
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @User('id') id: number,
    @Body() createData: RegionCreateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.regionService.create(createData, id);
    return {
      msg: 'Region Created Successfully',
      data: data,
      status: 'success',
    };
  }

  // Get All
  @Get('all')
  async findAll(): Promise<{ msg; data; status }> {
    const data = await this.regionService.findAll();
    return { msg: 'Get Region Successfully', data, status: 'success' };
  }

  // Get One
  @Get('single/:id')
  async One(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.regionService.findOne(id);
    return { msg: 'Get Region Successfully', data, status: 'success' };
  }

  // Update Section Id
  @UsePipes(new ValidationPipe())
  @Post('update-id')
  async updateId(
    @Body() updateData: RegionUpdateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.regionService.updateId(updateData);
    return { msg: 'Region Updated Successfully', data, status: 'success' };
  }

  // Delete Section id
  @Post('delete-id')
  async deleteId(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.regionService.deleteId(id);
    return { msg: 'Region Deleted Successfully', data, status: 'success' };
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
    const imageURL = `${req.protocol}://${req.get('Host')}/region-image/${
      image.filename
    }`;

    return {
      msg: 'Region Image Uploaded Successfully',
      data: imageURL,
      status: 'success',
    };
  }
}
