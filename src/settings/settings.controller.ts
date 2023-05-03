import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Param, UseGuards } from '@nestjs/common/decorators';
import { SettingsService } from './settings.service';
import { SettingCreateDto } from './dto/create.dto';
import { SettingUpdateDto } from './dto/update.dto';

import { SettingEntity } from './settings.entity';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { User } from '../shared/user.decorator';

@ApiBearerAuth()
@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingService: SettingsService) {}

  //   Get All
  @Get('all')
  async AllImages(): Promise<{ msg; data; status }> {
    const data = await this.settingService.findAll();
    return { msg: 'Get All Settings Successfully', data, status: 'success' };
  }

  //Get setting by id
  @Get('single/:id')
  async SettingById(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.settingService.findOne(id);
    return { msg: 'Get Settings Successfully', data, status: 'success' };
  }

  //Get by Setting name
  @Get('name/:name')
  async SettingByName(
    @Param('name') name: string
  ): Promise<{ msg; data; status }> {
    const data = await this.settingService.findByName(name);
    return { msg: 'Get Settings Successfully', data, status: 'success' };
  }

  //   create settings
  @UsePipes(new ValidationPipe())
  @Post('create')
  async createSettings(
    @User('id') id: number,
    @Body() createData: SettingCreateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.settingService.create(id, createData);

    return {
      msg: 'Settings Created Successfully',
      data,
      status: 'success',
    };
  }

  //   Update Settings
  @UsePipes(new ValidationPipe())
  @Post('update')
  async updateImages(
    @Body() bodyData: SettingUpdateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.settingService.update(bodyData);
    return { msg: 'Settings Updated Successfully', data, status: 'success' };
  }

  //   Delete
  @Post('delete')
  async deleteImage(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.settingService.delete(id);
    return { msg: 'Settings Deleted Successfully', data, status: 'success' };
  }
}
