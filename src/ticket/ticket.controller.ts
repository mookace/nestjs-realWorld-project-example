import {
  Get,
  Post,
  Body,
  Param,
  Controller,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { ticketCreateDto } from './dto/create.dto';
import { TicketEntity } from './ticket.entity';
import { ticketUpdateIdDto } from './dto/updateId.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { User } from '../shared/user.decorator';

@ApiBearerAuth()
@ApiTags('ticket')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // Create Section
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @User('id') id: number,
    @Body() createData: ticketCreateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.ticketService.create(createData, id);
    return {
      msg: 'Ticket Created Successfully',
      data: data,
      status: 'success',
    };
  }

  // Get All
  @Get('all')
  async findAll(): Promise<{ msg; data; status }> {
    const data = await this.ticketService.findAll();
    return { msg: 'Get Ticket Successfully', data, status: 'success' };
  }

  //Find By Status
  @Get('status/:code')
  async findByStatus(
    @Param('code') code: number
  ): Promise<{ msg; data; status }> {
    const data = await this.ticketService.findByStatus(code);
    return { msg: 'Get Ticket Successfully', data, status: 'success' };
  }

  // Get single
  @Get('single/:id')
  async findOne(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.ticketService.findOne(id);
    return { msg: 'Get Ticket Successfully', data, status: 'success' };
  }

  //update with id
  @UsePipes(new ValidationPipe())
  @Post('update')
  async updateId(
    @Body() updateData: ticketUpdateIdDto
  ): Promise<{ msg; data; status }> {
    const data = await this.ticketService.updateId(updateData);
    return { msg: 'Ticket Updated Successfully', data, status: 'success' };
  }

  // Delete Section with id
  @UsePipes(new ValidationPipe())
  @Post('delete')
  async deleteId(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.ticketService.deleteId(id);
    return { msg: 'Ticket Deleted Successfully', data, status: 'success' };
  }
}
