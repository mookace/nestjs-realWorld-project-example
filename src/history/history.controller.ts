import { Body, Controller, Sse } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common/decorators';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { Observable, map } from 'rxjs';
import { HistoryEntity } from './history.entity';
import { User } from '../shared/user.decorator';

@ApiBearerAuth()
@ApiTags('history')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  //Notification section

  //Send Notification
  @Sse('notifications')
  sse(@Res() res: Response, @Query('auth') auth: string): Observable<any> {
    const decoded: any = jwt.verify(auth, process.env.JWT_SECRET);
    return this.historyService.getNotificationStream().pipe(
      map((message) => {
        if (message['user_id'] == decoded.id) {
          res.write(`data: ${message['msg']}\n`);
        }
      })
    );
  }

  //All Notification
  @Get('all-notify')
  async AllNotify(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.historyService.AllNotify(id);
    return { msg: 'Get All Notification', data, status: 'success' };
  }

  //Unread notification
  @Get('unread-notify')
  async unreadNotify(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.historyService.unreadNotify(id);
    return { msg: 'Get UnRead Notification', data, status: 'success' };
  }

  //Read Single notification and change notify status
  @Post('read/:id')
  async Read(
    @Param('id') id: number,
    @User('id') user_id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.historyService.ReadSingle(id, user_id);
    return {
      msg: 'Read Noticiation Successfully',
      data,
      status: 'success',
    };
  }

  //Delete Notifiation
  @Post('notify-delete/:id')
  async DeleteNotify(
    @Param('id') id: number,
    @User('id') user_id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.historyService.deleteNotify(id, user_id);
    return {
      msg: 'Noticiation Deleted Successfully',
      data,
      status: 'success',
    };
  }

  //Delete All Notification
  @Post('notify-delete-all')
  async DeleteAllNotify(
    @User('id') user_id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.historyService.DeleteAllNotify(user_id);
    return {
      msg: 'Noticiation Deleted Successfully',
      data,
      status: 'success',
    };
  }

  //Mark all Notification as Read
  @Post('read-all')
  async ReadAll(@User('id') user_id: number): Promise<{ msg; data; status }> {
    const data = await this.historyService.ReadAllNotify(user_id);
    return {
      msg: 'Read All Noticiation Successfully',
      data,
      status: 'success',
    };
  }

  // Get My history
  @Get('my-history')
  async findMyHistory(
    @User('id') user_id: number,
    @User('roles') roles: number
  ): Promise<{ msg; data; status }> {
    const data = await this.historyService.findMyHistory(user_id, roles);
    return { msg: 'Get History Successfully', data, status: 'success' };
  }

  // change status from 0=>1
  @Post('status/:id')
  async changeStatus(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.historyService.changeStatus(id);
    return {
      msg: 'History Status Changed Successfully',
      data,
      status: 'success',
    };
  }

  //Delete history
  @Post('delete')
  async delete(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.historyService.delete(id);
    return { msg: 'History Deleted Successfully', data, status: 'success' };
  }
}
