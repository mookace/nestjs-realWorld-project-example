import { Controller, Post, Body, UsePipes, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetMessageDto } from './dto/get-message.dto';

import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { MessageService } from './message.service';

@ApiBearerAuth()
@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // Get All
  @UsePipes(new ValidationPipe())
  @Post('all')
  async findAll(
    @Body() GetData: GetMessageDto
  ): Promise<{ msg; data; status }> {
    const data = await this.messageService.findAll(GetData);
    return { msg: 'Get Message Successfully', data, status: 'success' };
  }

  // Get All User
  @UsePipes(new ValidationPipe())
  @Post('all-user-msg')
  async findAllUserMsg(
    @Body() GetData: GetMessageDto
  ): Promise<{ msg; data; status }> {
    const data = await this.messageService.findAllUserMsg(GetData);
    return { msg: 'Get Message Successfully', data, status: 'success' };
  }
}
