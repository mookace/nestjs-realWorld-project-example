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
import { EnquiryService } from './enquiry.service';
import { EnquiryDto } from './dto/enquiry.dto';
import { EnquiryEntity } from './enquiry.entity';
import { EnquiryUpdateIdDto } from './dto/updateId.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { EnquiryReplyDto } from './dto/reply.dto';
import { User } from '../shared/user.decorator';

@ApiBearerAuth()
@ApiTags('enquiry')
@Controller('enquiry')
export class EnquiryController {
  constructor(private readonly enquiryService: EnquiryService) {}

  // Create Section
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @User('id') id: number,
    @Body() enquiryData: EnquiryDto
  ): Promise<{ msg; data; status }> {
    const data = await this.enquiryService.create(enquiryData, id);
    return {
      msg: 'Enquiry Send Successfully',
      data: data,
      status: 'success',
    };
  }

  // vendor reply to customer
  @UsePipes(new ValidationPipe())
  @Post('reply')
  async reply(
    @User('id') id: number,
    @Body() enquiryData: EnquiryReplyDto
  ): Promise<{ msg; data; status }> {
    const data = await this.enquiryService.reply(enquiryData, id);
    return {
      msg: 'Enquiry Send Successfully',
      data: data,
      status: 'success',
    };
  }

  // Get by parent_id
  @Get('parent-id/:id')
  async parentId(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.enquiryService.parentId(id);
    return { msg: 'Get Enquiry Successfully', data, status: 'success' };
  }

  // Get All according to user Roles
  @Get('all')
  async findAll(
    @User('roles') roles: number,
    @User('id') id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.enquiryService.findAll(roles, id);
    return { msg: 'Get Enquiry Successfully', data, status: 'success' };
  }

  // Get one by id
  @Get('single/:id')
  async findOneById(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.enquiryService.findOneById(id);
    return { msg: 'Get Enquiry Successfully', data, status: 'success' };
  }

  //update with id
  @UsePipes(new ValidationPipe())
  @Post('update')
  async updateId(
    @Body() bodyData: EnquiryUpdateIdDto
  ): Promise<{ msg; data; status }> {
    const data = await this.enquiryService.updateId(bodyData);
    return { msg: 'Enquiry Updated Successfully', data, status: 'success' };
  }

  // Delete Section with id
  @UsePipes(new ValidationPipe())
  @Post('delete')
  async deleteId(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.enquiryService.deleteId(id);
    return { msg: 'Enquiry Deleted Successfully', data, status: 'success' };
  }
}
