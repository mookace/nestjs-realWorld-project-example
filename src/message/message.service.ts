import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import moment = require('moment');
import { HistoryEntity } from '../history/history.entity';
import { slugify } from '../shared/other-helper';
import { stringify } from 'querystring';
import { UserEntity } from '../user/user.entity';
import { GetMessageDto } from './dto/get-message.dto';
import * as jwt from 'jsonwebtoken';
import { MessageEntity } from './message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(HistoryEntity)
    private readonly historyRepository: Repository<HistoryEntity>
  ) {}
  // messages: MessageEntity[] = [{ name: 'sujit', text: 'heyoo' }];
  messages = [{ name: 'sujit', text: 'heyoo' }];
  clientTOUser = {};

  async identify(name: string, clientId: string) {
    this.clientTOUser[clientId] = name;
    return Object.values(this.clientTOUser);
  }

  async getClientByName(auth: string) {
    const decoded: any = jwt.verify(auth, process.env.JWT_SECRET);

    return decoded.username;
  }
  // async getClientByName(clientId: string) {
  //   return this.clientTOUser[clientId];
  // }

  async create(createMessageDto: CreateMessageDto) {
    const newMessage = new MessageEntity();
    newMessage.user_id = createMessageDto.user_id;
    newMessage.msg = createMessageDto.msg;
    newMessage.vendor_id = createMessageDto.vendor_id;
    const message = await this.messageRepository.save(newMessage);

    return message;
  }

  //Save history
  async saveHistory(message: MessageEntity): Promise<HistoryEntity> {
    const userSlug = await this.userRepository.findOne({
      where: { id: message.user_id },
    });

    const history = new HistoryEntity();
    history.slug = slugify('history');
    history.user_id = message.user_id;
    history.chat = message;
    history.message = 'Chat added in history';
    return await this.historyRepository.save(history);
  }

  async findAll(getData: GetMessageDto): Promise<MessageEntity[]> {
    const data = await this.messageRepository.find({
      where: { user_id: getData.user_id, vendor_id: getData.vendor_id },
      order: { created_at: 'DESC' },
    });
    return data;
  }

  async findAllUserMsg(getData: GetMessageDto): Promise<MessageEntity[]> {
    const data = await this.messageRepository.find({
      where: { user_id: getData.user_id },
      order: { created_at: 'DESC' },
    });
    return data;
  }
}
