import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { BannerService } from './banner.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { BannerDto } from './dto/create.dto';
import { Param, Patch, Req } from '@nestjs/common/decorators';
import { Express, Request } from 'express';
import { BannerEntity } from './banner.entity';
import { BannerUpdateIdDto } from './dto/updateId.dto';
import { User } from '../shared/user.decorator';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { DeleteIdDto } from '../shared/dto/delete-id.dto';

//Image Storage
const storage = diskStorage({
  destination: './images/banner-image',
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
@ApiTags('banner')
@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  // Get All
  @Get('all')
  async AllImages(): Promise<{ msg; data; status }> {
    const data = await this.bannerService.findAllImage();
    return { msg: 'Get Banner Images Successfully', data, status: 'success' };
  }

  //Get Banner by id
  @Get('image/:id')
  async ImageByProductSlug(
    @Param('id') id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.bannerService.findImageById(id);
    return { msg: 'Get Banner Image Successfully', data, status: 'success' };
  }

  //Get banner according to user
  @Get('user')
  async ImageByUser(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.bannerService.findByUser(id);
    return { msg: 'Get Banner Image Successfully', data, status: 'success' };
  }

  //create Banner image

  @UsePipes(new ValidationPipe())
  @Post('create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage }))
  async createBannerImage(
    @User('id') id: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() createData: BannerDto,
    @Req() req: Request
  ): Promise<{ msg; data; status }> {
    console.log('create');
    const imageURL = `${req.protocol}://${req.get('Host')}/banner-image/${
      image.filename
    }`;

    const data = await this.bannerService.createImage(
      id,
      createData,
      imageURL,
      image.filename
    );

    return {
      msg: 'Banner Image Created Successfully',
      data,
      status: 'success',
    };
  }

  //Update Image main By Id
  @UsePipes(new ValidationPipe())
  @Post('update')
  async updateImagesById(
    @Body() bodyData: BannerUpdateIdDto
  ): Promise<{ msg; data; status }> {
    const data = await this.bannerService.updateImageById(bodyData);
    return {
      msg: 'Banner Image Updated Successfully',
      data,
      status: 'success',
    };
  }

  //Delete Image with id
  @UsePipes(new ValidationPipe())
  @Post('delete')
  async deleteImageId(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.bannerService.deleteImageId(id);
    return {
      msg: 'Banner Image Deleted Successfully',
      data,
      status: 'success',
    };
  }
}
