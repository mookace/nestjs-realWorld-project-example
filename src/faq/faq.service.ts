import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { slugify } from '../shared/other-helper';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { FaqEntity } from './faq.entity';
import { FaqCreateDto } from './dto/create.dto';
import { FaqUpdateIdDto } from './dto/updateId.dto';
import { FaqAnsDto } from './dto/ans.dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(FaqEntity)
    private readonly faqRepository: Repository<FaqEntity>
  ) {}

  //create qsn
  async createQsn(data: FaqCreateDto, id: number): Promise<FaqEntity> {
    const newData = new FaqEntity();

    newData.slug = slugify('faq');
    newData.user_id = id;
    newData.qsn = data.qsn;
    newData.status = 0;

    const saveData = await this.faqRepository.save(newData);

    return saveData;
  }

  //create ans
  async createAns(data: FaqAnsDto, id: number): Promise<FaqEntity> {
    const newData = new FaqEntity();

    newData.slug = slugify('faq');
    newData.user_id = id;
    newData.qsn_id = data.qsn_id;
    newData.ans = data.ans;
    newData.status = 1;

    const saveData = await this.faqRepository.save(newData);

    return saveData;
  }

  //find all
  async findAll(): Promise<FaqEntity[]> {
    const data = await this.faqRepository.find({
      where: { is_deleted: false },
    });

    return data;
  }

  //find all qsn ans
  async AllAns(qsn_id: number): Promise<FaqEntity[]> {
    const data = await this.faqRepository.find({
      where: { qsn_id: qsn_id, status: 1, is_deleted: false },
      order: { id: 'ASC' },
    });

    return data;
  }

  //find One
  async findOne(id: number): Promise<FaqEntity> {
    const data = await this.faqRepository.findOne({
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
  async updateId(data: FaqUpdateIdDto, id: number): Promise<FaqEntity> {
    let toUpdate = await this.faqRepository.findOne({
      where: { id: data.id, user_id: id, is_deleted: false },
    });

    if (!toUpdate) {
      throw new HttpException(
        {
          msg: 'Not Allowed',
          errors: { msg: `Not Allowed` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    toUpdate.updated_at = new Date();

    let update = Object.assign(toUpdate, data);
    return await this.faqRepository.save(update);
  }

  //delete with id
  async deleteId(id: number): Promise<FaqEntity> {
    let toDelete = await this.faqRepository.findOne({
      where: { id: id },
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
    return await this.faqRepository.save(deleted);
  }
}
