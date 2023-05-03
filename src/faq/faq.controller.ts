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
import { FaqService } from './faq.service';
import { FaqCreateDto } from './dto/create.dto';
import { FaqEntity } from './faq.entity';
import { FaqUpdateIdDto } from './dto/updateId.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { User } from '../shared/user.decorator';
import { FaqAnsDto } from './dto/ans.dto';

@ApiBearerAuth()
@ApiTags('faq')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  // Create qsn
  @UsePipes(new ValidationPipe())
  @Post('create-qsn')
  async createQsn(
    @User('id') id: number,
    @Body() createData: FaqCreateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.faqService.createQsn(createData, id);
    return { msg: 'FAQ Created Successfully', data: data, status: 'success' };
  }

  //Create ans
  @UsePipes(new ValidationPipe())
  @Post('create-ans')
  async createAns(
    @User('id') id: number,
    @Body() createData: FaqAnsDto
  ): Promise<{ msg; data; status }> {
    const data = await this.faqService.createAns(createData, id);
    return { msg: 'FAQ Created Successfully', data: data, status: 'success' };
  }

  // Get All
  @Get('all')
  async findAll(): Promise<{ msg; data; status }> {
    const data = await this.faqService.findAll();
    return { msg: 'Get FAQ Successfully', data, status: 'success' };
  }

  // Get All ans of qsn
  @Get('all-ans/:id')
  async AllAns(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.faqService.AllAns(id);
    return { msg: 'Get FAQ Successfully', data, status: 'success' };
  }

  // Get single
  @Get('single/:id')
  async findOne(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.faqService.findOne(id);
    return { msg: 'Get FAQ Successfully', data, status: 'success' };
  }

  //update with id
  @UsePipes(new ValidationPipe())
  @Post('update')
  async updateId(
    @User('id') id: number,
    @Body() updateData: FaqUpdateIdDto
  ): Promise<{ msg; data; status }> {
    const data = await this.faqService.updateId(updateData, id);
    return { msg: 'FAQ Updated Successfully', data, status: 'success' };
  }

  // Delete Section Id
  @Post('delete')
  async deleteId(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.faqService.deleteId(id);
    return { msg: 'FAQ Deleted Successfully', data, status: 'success' };
  }
}
