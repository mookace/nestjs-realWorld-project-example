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
import { TradeService } from './trade.service';
import { TradeCreateDto } from './dto/create.dto';
import { TradeUpdateDto } from './dto/update.dto';
import { User } from '../shared/user.decorator';

const storage = diskStorage({
  destination: './images/trade-image',
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

@ApiBearerAuth()
@ApiTags('trade')
@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  // Create Section
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @User('id') id: number,
    @Body() createData: TradeCreateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.tradeService.create(createData, id);
    return {
      msg: 'Trade Created Successfully',
      data: data,
      status: 'success',
    };
  }

  // Get All
  @Get('all')
  async findAll(): Promise<{ msg; data; status }> {
    const data = await this.tradeService.findAll();
    return { msg: 'Get Trade Successfully', data, status: 'success' };
  }

  // Get One
  @Get('single/:id')
  async One(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.tradeService.findOne(id);
    return { msg: 'Get Trade Successfully', data, status: 'success' };
  }

  // Update Section Id
  @UsePipes(new ValidationPipe())
  @Post('update-id')
  async updateId(
    @Body() updateData: TradeUpdateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.tradeService.updateId(updateData);
    return { msg: 'Trade Updated Successfully', data, status: 'success' };
  }

  // Delete Section id
  @Post('delete-id')
  async deleteId(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.tradeService.deleteId(id);
    return { msg: 'Trade Deleted Successfully', data, status: 'success' };
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
    const imageURL = `${req.protocol}://${req.get('Host')}/trade-image/${
      image.filename
    }`;

    return {
      msg: 'Trade Image Uploaded Successfully',
      data: imageURL,
      status: 'success',
    };
  }
}
