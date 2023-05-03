import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { slugify } from '../shared/other-helper';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { AttributesEntity } from './attributes.entity';
import { AttributeCreateDto } from './dto/create.dto';
import { AttributeUpdateIdDto } from './dto/updateId.dto';
import { DeleteIdDto } from '../shared/dto/delete-id.dto';

@Injectable()
export class AttributesService {
  constructor(
    @InjectRepository(AttributesEntity)
    private readonly attributeRepository: Repository<AttributesEntity>
  ) {}

  //create
  async create(
    data: AttributeCreateDto,
    id: number
  ): Promise<AttributesEntity> {
    const newData = new AttributesEntity();

    newData.slug = slugify('attribute');
    newData.user_id = id;
    newData.att_id = data.att_id;
    newData.name = data.name;
    newData.attribute = data.attribute;
    newData.status = data.status;

    const saveData = await this.attributeRepository.save(newData);

    return saveData;
  }

  //find all
  async findAll(): Promise<AttributesEntity[]> {
    const data = await this.attributeRepository.find({
      where: { is_deleted: false },
      order: { id: 'ASC' },
    });

    return data;
  }

  //find By Att ID
  async ByAttId(id: number): Promise<AttributesEntity[]> {
    const data = await this.attributeRepository.find({
      where: { att_id: id, is_deleted: false },
    });

    return data;
  }

  //find One
  async findOne(id: number): Promise<AttributesEntity> {
    const data = await this.attributeRepository.findOne({
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

  //find by user
  async findByUser(user_id: number): Promise<AttributesEntity[]> {
    const data = await this.attributeRepository.find({
      where: { is_deleted: false, user_id: user_id },
      order: { id: 'ASC' },
    });
    return data;
  }

  //find by status
  async findByStatus(code: number): Promise<AttributesEntity[]> {
    const data = await this.attributeRepository.find({
      where: { is_deleted: false, status: code },
      order: { id: 'ASC' },
    });
    return data;
  }

  //update with ID
  async updateId(data: AttributeUpdateIdDto): Promise<AttributesEntity> {
    let toUpdate = await this.attributeRepository.findOne({
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

    toUpdate.updated_at = new Date();

    let update = Object.assign(toUpdate, data);
    return await this.attributeRepository.save(update);
  }

  //delete with Id
  async deleteId(id: number): Promise<AttributesEntity> {
    let toDelete = await this.attributeRepository.findOne({
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
    return await this.attributeRepository.save(deleted);
  }
}
