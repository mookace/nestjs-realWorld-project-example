import {
  Get,
  Post,
  Body,
  Param,
  Controller,
  UsePipes,
  ParseArrayPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ColorCreateIdDto } from './dto/create.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ColourService } from './colour.service';
import { User } from '../shared/user.decorator';

@ApiBearerAuth()
@ApiTags('colour')
@Controller('colour')
export class ColourController {
  constructor(private readonly colourService: ColourService) {}

  // Get All Data
  @Get('all')
  async findAll(): Promise<{ msg; data; status }> {
    const data = await this.colourService.findAll();
    return {
      msg: 'Get Colour Successfully',
      data,
      status: 'success',
    };
  }

  //Get colour by id
  @Get('colour/:id')
  async findColourVariation(
    @Param('id') id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.colourService.findById(id);
    return {
      msg: 'Get Colour Successfully',
      data,
      status: 'success',
    };
  }

  // Get by product id
  @Get('product/:id')
  async findByProduct(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.colourService.findByProduct(id);
    return {
      msg: 'Get Colour Successfully',
      data,
      status: 'success',
    };
  }

  //  Create
  @UsePipes(new ValidationPipe())
  @Post('create')
  async createId(
    @User('id') id: number,
    @Body('data', new ParseArrayPipe({ items: ColorCreateIdDto }))
    colorData: ColorCreateIdDto[]
  ): Promise<{ msg; data; status }> {
    const data = await this.colourService.createId(colorData, id);
    return {
      msg: 'Colour Created Successfully',
      data: data,
      status: 'success',
    };
  }

  // Delete Section with id
  @Post('delete')
  async deleteId(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.colourService.deleteId(id);
    return {
      msg: 'Colour Deleted Successfully',
      data,
      status: 'success',
    };
  }
}
