import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { slugify } from '../shared/other-helper';
import { TradeEntity } from './trade.entity';
import { TradeCreateDto } from './dto/create.dto';
import { TradeUpdateDto } from './dto/update.dto';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(TradeEntity)
    private readonly tradeRepository: Repository<TradeEntity>
  ) {}

  //create
  async create(data: TradeCreateDto, id: number): Promise<TradeEntity> {
    const newData = new TradeEntity();
    newData.slug = slugify('trade');
    newData.user_id = id;
    newData.name = data.name;
    newData.image = data.image;
    newData.others = data.others;
    newData.status = data.status;

    const saveData = await this.tradeRepository.save(newData);

    return saveData;
  }

  //find all
  async findAll(): Promise<TradeEntity[]> {
    const data = await this.tradeRepository.find({
      where: { is_deleted: false },
    });

    return data;
  }

  //find one
  async findOne(id: number): Promise<TradeEntity> {
    const data = await this.tradeRepository.findOne({
      where: { id: id, is_deleted: false },
    });

    return data;
  }

  // Update Id
  async updateId(dto: TradeUpdateDto): Promise<TradeEntity> {
    let toUpdate = await this.tradeRepository.findOne({
      where: { id: dto.id, is_deleted: false },
    });

    if (!toUpdate) {
      throw new HttpException(
        {
          msg: 'Data Not Found',
          errors: { msg: `Data Not Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    toUpdate.updated_at = new Date();

    let updated = Object.assign(toUpdate, dto);
    return await this.tradeRepository.save(updated);
  }

  // delete with id
  async deleteId(id: number): Promise<TradeEntity> {
    let toDelete = await this.tradeRepository.findOne({
      where: { id: id, is_deleted: false },
    });

    if (!toDelete) {
      throw new HttpException(
        {
          msg: 'Data Not Found',
          errors: { msg: `Data Not Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    let deleted = Object.assign(toDelete, {
      is_deleted: true,
      deleted_at: new Date(),
    });
    return await this.tradeRepository.save(deleted);
  }
}
