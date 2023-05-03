import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Query, UseGuards } from '@nestjs/common/decorators';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { SizeService } from './size.service';
import { User } from '../shared/user.decorator';
import { CreateSizeDto } from './dto/create.dto';
import { SizeUpdateDto } from './dto/update.dto';

@ApiBearerAuth()
@ApiTags('size')
@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  //Create new size
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @User('id') id: number,
    @Body('data', new ParseArrayPipe({ items: CreateSizeDto }))
    sizeData: CreateSizeDto[]
  ): Promise<{ msg; data; status }> {
    const data = await this.sizeService.create(sizeData, id);
    return { msg: 'Size Created Successfully', data: data, status: 'success' };
  }

  // Find Product By Price Range
  @Get('price-range')
  async findByPriceRange(
    @Query('min') min: number,
    @Query('max') max: number
  ): Promise<{ msg; data; status }> {
    const data = await this.sizeService.findByPrice(min, max);
    return { msg: 'Get Size Successfully', data, status: 'success' };
  }

  //Get find by product id
  @Get('product/:id')
  async ProductId(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.sizeService.ProductId(id);
    return { msg: 'Get Size Successfully', data, status: 'success' };
  }

  //find by colour id
  @Get('colour/:id')
  async findByColourId(
    @Param('id') id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.sizeService.findByColourId(id);
    return { msg: 'Get Size Successfully', data, status: 'success' };
  }

  //Get Single Size Variation with id
  @Get('single/:id')
  async findSizeOne(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.sizeService.findOneSize(id);
    return { msg: 'Get Size Successfully', data, status: 'success' };
  }

  //Update Size Variation with id
  @UsePipes(new ValidationPipe())
  @Post('update')
  async UpdateId(
    @Body('data', new ParseArrayPipe({ items: SizeUpdateDto }))
    sizeData: SizeUpdateDto[]
  ): Promise<{ msg; data; status }> {
    const data = await this.sizeService.updateId(sizeData);
    return {
      msg: 'Size Updated Successfully',
      data: data,
      status: 'success',
    };
  }

  //Delete Size Variation with id
  @UsePipes(new ValidationPipe())
  @Post('delete')
  async deleteId(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.sizeService.deleteId(id);
    return { msg: 'Size Deleted Successfully', data, status: 'success' };
  }
}
