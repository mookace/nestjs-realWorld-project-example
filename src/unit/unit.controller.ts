import { Get, Post, Body, Param, Controller, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UnitService } from './unit.service';
import { UnitCreateDto } from './dto/create-unit.dto';
import { UnitUpdateDto } from './dto/update-unit.dto';
import { User } from '../shared/user.decorator';

@ApiBearerAuth()
@ApiTags('unit')
@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  // Create Section
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @User('id') id: number,
    @Body() createData: UnitCreateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.unitService.create(createData, id);
    return { msg: 'Unit Created Successfully', data: data, status: 'success' };
  }

  // Get All
  @Get('all')
  async findAll(): Promise<{ msg; data; status }> {
    const data = await this.unitService.findAll();
    return { msg: 'Get Unit Successfully', data, status: 'success' };
  }

  // Get one
  @Get('single/:id')
  async findOne(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.unitService.findOne(id);
    return { msg: 'Get Unit Successfully', data, status: 'success' };
  }

  //Get By user Id
  @Get('user')
  async findByUser(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.unitService.findByUser(id);
    return { msg: 'Get Unit Successfully', data, status: 'success' };
  }

  //update
  @UsePipes(new ValidationPipe())
  @Post('update')
  async update(
    @Body() bodyData: UnitUpdateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.unitService.update(bodyData);
    return { msg: 'Unit Updated Successfully', data, status: 'success' };
  }

  // Delete Section
  @Post('delete')
  async delete(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.unitService.delete(id);
    return { msg: 'Unit Deleted Successfully', data, status: 'success' };
  }
}
