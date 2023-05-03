import {
  Get,
  Post,
  Body,
  Controller,
  UsePipes,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CompanyCreateDto } from './dto/create.dto';
import { CompanyUpdateDto } from './dto/update.dto';
import { CompanyEntity } from './company.entity';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { User } from '../shared/user.decorator';

@ApiBearerAuth()
@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // Get All Data
  @Get('all')
  async findAll(): Promise<{ msg; data; status }> {
    const data = await this.companyService.all();
    return { msg: 'Get Company Successfully', data, status: 'success' };
  }

  // Get Own company
  @Get('own')
  async OwnCompany(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.companyService.ownCompany(id);
    return { msg: 'Get Company Successfully', data, status: 'success' };
  }

  //Get single
  @Get('single/:id')
  async single(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.companyService.single(id);
    return { msg: 'Get Company Successfully', data, status: 'success' };
  }

  //update by admin
  @UsePipes(new ValidationPipe())
  @Post('update')
  async update(
    @Body() bodyData: CompanyUpdateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.companyService.update(bodyData);
    return { msg: 'Company Updated Successfully', data, status: 'success' };
  }

  //update own company
  @UsePipes(new ValidationPipe())
  @Post('update-own')
  async updateByUser(
    @User('id') id: number,
    @Body() bodyData: CompanyCreateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.companyService.updateByUser(bodyData, id);
    return { msg: 'Company Updated Successfully', data, status: 'success' };
  }

  // Delete Section
  @UsePipes(new ValidationPipe())
  @Post('delete')
  async delete(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.companyService.delete(id);
    return { msg: 'Company Deleted Successfully', data, status: 'success' };
  }
}
