import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { slugify } from '../shared/other-helper';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { TicketEntity } from './ticket.entity';
import { ticketCreateDto } from './dto/create.dto';
import { HistoryService } from '../history/history.service';
import { HistoryEntity } from '../history/history.entity';
import { ticketUpdateIdDto } from './dto/updateId.dto';

@Injectable()
export class TicketService {
  constructor(
    private readonly notificationService: HistoryService,

    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    @InjectRepository(HistoryEntity)
    private readonly historyRepository: Repository<HistoryEntity>
  ) {}

  //notification
  public sendNotification(user_id: number, msg: string) {
    this.notificationService.sendNotification(user_id, msg);
    return 'Notification sent';
  }

  //create
  async create(data: ticketCreateDto, id: number): Promise<TicketEntity> {
    const newData = new TicketEntity();

    newData.slug = slugify('ticket');
    newData.user_id = id;
    newData.body = data.body;
    newData.status = data.status;
    newData.priority = data.priority;

    const saveData = await this.ticketRepository.save(newData);
    const history = new HistoryEntity();
    history.slug = slugify('history');
    history.user_id = id;
    history.ticket = saveData;
    history.message = 'Ticket added in history';
    history.notify = 1;
    const newHistory = await this.historyRepository.save(history);

    //send notification
    this.sendNotification(id, JSON.stringify(newHistory));
    return saveData;
  }

  //find all
  async findAll(): Promise<TicketEntity[]> {
    const data = await this.ticketRepository.find();

    return data;
  }

  //find by status
  async findByStatus(code: number): Promise<TicketEntity[]> {
    const data = await this.ticketRepository.find({ where: { status: code } });

    return data;
  }

  //find One
  async findOne(id: number): Promise<TicketEntity> {
    const data = await this.ticketRepository.findOne({
      where: { is_deleted: false, id: id },
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
    return data;
  }

  //update with id
  async updateId(data: ticketUpdateIdDto): Promise<TicketEntity> {
    let toUpdate = await this.ticketRepository.findOne({
      where: { id: data.id, is_deleted: false },
    });

    if (!toUpdate) {
      throw new HttpException(
        {
          msg: 'No Data Found',
          errors: { msg: `No Data Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    if (!toUpdate.slug) {
      toUpdate.slug = slugify('ticket');
    }

    toUpdate.updated_at = new Date();

    let update = Object.assign(toUpdate, data);
    const updatedData = await this.ticketRepository.save(update);
    return updatedData;
  }

  //delete with id
  async deleteId(id: number): Promise<TicketEntity> {
    let toDelete = await this.ticketRepository.findOne({
      where: { id: id, is_deleted: false },
    });

    if (!toDelete) {
      throw new HttpException(
        {
          msg: 'No Data Found',
          errors: { msg: `No Data Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    let deleted = Object.assign(toDelete, {
      is_deleted: true,
      deleted_at: new Date(),
    });
    return await this.ticketRepository.save(deleted);
  }
}
