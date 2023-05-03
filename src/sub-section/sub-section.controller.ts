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
import { Request } from 'express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImageDto } from '../shared/dto/image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubSectionService } from './sub-section.service';
import { SubSectionCreateDto } from './dto/create.dto';
import { SubSectionUpdateDto } from './dto/update.dto';
import { User } from '../shared/user.decorator';

const storage = diskStorage({
  destination: './images/sub-section-image',
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

@ApiBearerAuth()
@ApiTags('sub-section')
@Controller('sub-section')
export class SubSectionController {
  constructor(private readonly subSectionService: SubSectionService) {}

  // Create Section
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @User('id') id: number,
    @Body() createData: SubSectionCreateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.subSectionService.create(createData, id);
    return {
      msg: 'Sub-Section Created Successfully',
      data: data,
      status: 'success',
    };
  }

  // Get All
  @Get('all')
  async findAll(): Promise<{ msg; data; status }> {
    const data = await this.subSectionService.findAll();
    return { msg: 'Get Sub-Section Successfully', data, status: 'success' };
  }

  // Get One
  @Get('single/:id')
  async One(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.subSectionService.findOne(id);
    return { msg: 'Get Sub-Section Successfully', data, status: 'success' };
  }

  // Update Section Id
  @UsePipes(new ValidationPipe())
  @Post('update-id')
  async updateId(
    @Body() updateData: SubSectionUpdateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.subSectionService.updateId(updateData);
    return { msg: 'Sub-Section Updated Successfully', data, status: 'success' };
  }

  // Delete Section id
  @Post('delete-id')
  async deleteId(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.subSectionService.deleteId(id);
    return { msg: 'Sub-Section Deleted Successfully', data, status: 'success' };
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
    const imageURL = `${req.protocol}://${req.get('Host')}/sub-section-image/${
      image.filename
    }`;

    return {
      msg: 'Sub-Section Image Uploaded Successfully',
      data: imageURL,
      status: 'success',
    };
  }
}
