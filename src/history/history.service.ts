import { Injectable } from '@nestjs/common';
import { HistoryEntity } from './history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { Subject } from 'rxjs';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryEntity)
    private readonly historyRepository: Repository<HistoryEntity>
  ) {}
  //notification start
  private notificationSubject = new Subject();

  public sendNotification(user_id: number, msg: string) {
    this.notificationSubject.next({ user_id, msg });
  }

  public getNotificationStream() {
    return this.notificationSubject.asObservable();
  }

  //notification end

  async findMyHistory(
    user_id: number,
    roles: number
  ): Promise<HistoryEntity[]> {
    if (user_id && roles == 1) {
      const data = await this.historyRepository.find({
        where: { is_deleted: false, ticket: Not(IsNull()) },
      });

      return data;
    } else {
      const data = await this.historyRepository.find({
        where: { is_deleted: false, user_id: user_id },
        order: { id: 'DESC' },
      });

      return data;
    }
  }

  //unread notify
  async unreadNotify(id: number): Promise<any> {
    const data = await this.historyRepository.find({
      where: {
        user_id: id,
        is_deleted: false,
        notify: 1,
        notify_deleted: false,
      },
      order: { id: 'DESC' },
    });

    return data;
  }

  //All Notification
  async AllNotify(id: number): Promise<HistoryEntity[]> {
    const data = await this.historyRepository.find({
      where: { user_id: id, is_deleted: false, notify_deleted: false },
      order: { id: 'DESC' },
    });

    return data;
  }

  //Mark All Notification as Read
  async ReadAllNotify(user_id: number): Promise<any> {
    const data = await this.historyRepository
      .createQueryBuilder('history')
      .update(HistoryEntity)
      .set({ notify: 0 })
      .where('history.is_deleted = :is_deleted', { is_deleted: false })
      .andWhere('history.user=:user', { user_id: user_id })
      .execute();

    return data;
  }

  //Read single notification
  async ReadSingle(id: number, user_id: number): Promise<HistoryEntity> {
    const data = await this.historyRepository.findOne({
      where: {
        id: id,
        user_id: user_id,
        is_deleted: false,
        notify_deleted: false,
      },
    });
    if (!data) {
      throw new HttpException(
        {
          msg: 'No Data Found',
          errors: { msg: `No Data Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }
    const saveHistory = Object.assign(data, { notify: 0 });
    return await this.historyRepository.save(saveHistory);
  }

  //delete single notify
  async deleteNotify(id: number, user_id: number): Promise<HistoryEntity> {
    const data = await this.historyRepository.findOne({
      where: {
        id: id,
        user_id: user_id,
        is_deleted: false,
        notify_deleted: false,
      },
    });
    if (!data) {
      throw new HttpException(
        {
          msg: 'No Data Found',
          errors: { msg: `No Data Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }
    const saveHistory = Object.assign(data, { notify_deleted: true });
    return await this.historyRepository.save(saveHistory);
  }

  //Delete all notification
  async DeleteAllNotify(user_id: number): Promise<any> {
    const data = await this.historyRepository
      .createQueryBuilder('history')
      .update(HistoryEntity)
      .set({ notify_deleted: true })
      .where('history.is_deleted = :is_deleted', { is_deleted: false })
      .andWhere('history.user=:user', { user_id: user_id })
      .execute();

    return data;
  }

  async changeStatus(id: number): Promise<any> {
    const data = await this.historyRepository.findOne({ where: { id: id } });

    data.status = 1;
    data.updated_at = new Date();
    return await this.historyRepository.save(data);
  }

  async delete(id: number): Promise<any> {
    return await this.historyRepository.delete({ id: id });
  }
}
