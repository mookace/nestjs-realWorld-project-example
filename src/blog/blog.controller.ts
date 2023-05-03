import {
  Get,
  Post,
  Body,
  Param,
  Controller,
  UsePipes,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { BlogCreateDto } from './dto/create.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageDto } from '../shared/dto/image.dto';
import { Request } from 'express';
import { BlogEntity } from './blog.entity';
import { BlogUpdateIdDto } from './dto/updateId.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { User } from '../shared/user.decorator';

const storage = diskStorage({
  destination: './images/blog-image',
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
  // return req.filename
});

@ApiBearerAuth()
@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // Create Section
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @User('id') id: number,
    @Body() createData: BlogCreateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.blogService.create(createData, id);
    return { msg: 'Blog Created Successfully', data: data, status: 'success' };
  }

  // Get All
  @Get('all')
  async findAll(): Promise<{ msg; data; status }> {
    const data = await this.blogService.findAll();
    return { msg: 'Get Blog Successfully', data, status: 'success' };
  }

  // Get single
  @Get('single/:id')
  async findOne(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.blogService.findOne(id);
    return { msg: 'Get Blog Successfully', data, status: 'success' };
  }

  //Get By user Id
  @Get('user/:id')
  async findByUser(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.blogService.findByUser(id);
    return { msg: 'Get Blog Successfully', data, status: 'success' };
  }

  //update Id
  @UsePipes(new ValidationPipe())
  @Post('update')
  async updateId(
    @Body() bodyData: BlogUpdateIdDto
  ): Promise<{ msg; data; status }> {
    const data = await this.blogService.updateId(bodyData);
    return { msg: 'Blog UPdated Successfully', data, status: 'success' };
  }

  // Delete Section Id
  @UsePipes(new ValidationPipe())
  @Post('delete')
  async deleteId(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.blogService.deleteId(id);
    return { msg: 'Blog Deleted Successfully', data, status: 'success' };
  }

  //Create image Url
  @Post('imageurl')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage }))
  async CreateImageUrl(
    @Body() data: ImageDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req: Request
  ): Promise<{ msg; data; status }> {
    const imageURL = `${req.protocol}://${req.get('Host')}/blog-image/${
      image.filename
    }`;

    return {
      msg: 'Blog Image Uploaded Successfully',
      data: imageURL,
      status: 'success',
    };
  }
}
