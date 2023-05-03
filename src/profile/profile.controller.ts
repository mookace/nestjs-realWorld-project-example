import {
  Get,
  Post,
  Body,
  Req,
  UploadedFile,
  UseInterceptors,
  Controller,
  UsePipes,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImageDto } from '../shared/dto/image.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { User } from '../shared/user.decorator';

const storage = diskStorage({
  destination: './images/user-image',
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

@ApiBearerAuth()
@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // update profile
  @UsePipes(new ValidationPipe())
  @Post('update')
  async create(
    @User('id') id: number,
    @Body() userData: UpdateProfileDto
  ): Promise<{ msg; data; status }> {
    const data = await this.profileService.update(id, userData);
    return {
      msg: 'Profile Updated Successfully',
      data: data,
      status: 'success',
    };
  }

  //Get Single Profile with id
  @Get('single/:user_id')
  async GetOne(
    @Param('user_id') user_id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.profileService.findOneId(user_id);
    return { msg: 'Get Profile Successfully', data, status: 'success' };
  }

  //Image url
  @Post('imageurl')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage }))
  async CreateImageUrl(
    @Body() data: ImageDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req: Request
  ): Promise<{ msg; data; status }> {
    if (!image) {
      throw new HttpException(
        {
          msg: 'image should not be empty',
          errors: { msg: 'image should not be empty' },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const imageURL = `${req.protocol}://${req.get('Host')}/user-image/${
      image.filename
    }`;

    return {
      msg: 'Profile Image Uploaded Successfully',
      data: imageURL,
      status: 'success',
    };
  }
}
