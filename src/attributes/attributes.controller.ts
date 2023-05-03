import {
  Get,
  Post,
  Body,
  Param,
  Controller,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { AttributesService } from './attributes.service';
import { AttributeCreateDto } from './dto/create.dto';
import { AttributeUpdateIdDto } from './dto/updateId.dto';
import { AttributesEntity } from './attributes.entity';
import { User } from '../shared/user.decorator';
import { DeleteIdDto } from '../shared/dto/delete-id.dto';

@ApiBearerAuth()
@ApiTags('attributes')
@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributeService: AttributesService) {}

  // Create Section
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @User('id') id: number,
    @Body() createData: AttributeCreateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.attributeService.create(createData, id);
    return {
      msg: 'Attribute Created Successfully',
      data: data,
      status: 'success',
    };
  }

  // Get All
  @Get('all')
  async findAll(): Promise<{ msg; data; status }> {
    const data = await this.attributeService.findAll();
    return { msg: 'Get Attribute Successfully', data, status: 'success' };
  }

  // Get one
  @Get('single/:id')
  async findOne(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.attributeService.findOne(id);
    return { msg: 'Get Attribute Successfully', data, status: 'success' };
  }

  //Find By Attribute_id
  @Get('att/:id')
  async findAtt(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.attributeService.ByAttId(id);
    return { msg: 'Get Attribute Successfully', data, status: 'success' };
  }

  //Get By user Id
  @Get('user')
  async findByUser(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.attributeService.findByUser(id);
    return { msg: 'Get Attribute Successfully', data, status: 'success' };
  }

  //Get By status
  @Get('status/:code')
  async GetByStatus(
    @Param('code') code: number
  ): Promise<{ msg; data; status }> {
    const data = await this.attributeService.findByStatus(code);
    return { msg: 'Get Attribute Successfully', data, status: 'success' };
  }

  //update with id
  @UsePipes(new ValidationPipe())
  @Post('update')
  async updateData(
    @Body() bodyData: AttributeUpdateIdDto
  ): Promise<{ msg; data; status }> {
    const data = await this.attributeService.updateId(bodyData);
    return { msg: 'Attribute Updated Successfully', data, status: 'success' };
  }

  // Delete Section with id
  @UsePipes(new ValidationPipe())
  @Post('delete')
  async deleteid(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.attributeService.deleteId(id);
    return { msg: 'Attribute Deleted Successfully', data, status: 'success' };
  }
}
