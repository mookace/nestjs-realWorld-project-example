import {
  Get,
  Post,
  Body,
  Controller,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FavouriteService } from './favourite.service';
import { FavCreateDto } from './dto/fav-create.dto';
import { FavouriteEntity } from './favourite.entity';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { User } from '../shared/user.decorator';

@ApiBearerAuth()
@ApiTags('favourite')
@Controller('favourite')
export class FavouriteController {
  constructor(private readonly favService: FavouriteService) {}

  // Create Section
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @User('id') id: number,
    @Body() createData: FavCreateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.favService.create(createData, id);
    return {
      msg: 'Favourite Created Successfully',
      data: data,
      status: 'success',
    };
  }

  // Get my fav
  @Get('my-fav')
  async findFav(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.favService.findmyFav(id);
    return { msg: 'Get Favourite Successfully', data, status: 'success' };
  }

  // Delete Section with id
  @UsePipes(new ValidationPipe())
  @Post('delete')
  async deleteFavId(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.favService.deleteId(id);
    return { msg: 'Favourite Deleted Successfully', data, status: 'success' };
  }
}
