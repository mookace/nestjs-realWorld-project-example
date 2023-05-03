import { Get, Post, Body, Param, Controller, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RatingService } from './rating.service';
import { ratingCreateDto } from './dto/create.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { User } from '../shared/user.decorator';

@ApiBearerAuth()
@ApiTags('rating')
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  // Create Section
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @User('id') id: number,
    @Body() createData: ratingCreateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.ratingService.create(createData, id);
    return {
      msg: 'Rating Created Successfully',
      data: data,
      status: 'success',
    };
  }

  // Get All
  @Get('all')
  async findAll(): Promise<{ msg; data; status }> {
    const data = await this.ratingService.findAll();
    return { msg: 'Get Rating Successfully', data, status: 'success' };
  }

  @Get('product/:id')
  async findByProduct(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.ratingService.FindByProductId(id);
    return { msg: 'Get Rating Successfully', data, status: 'success' };
  }
}
