import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { slugify } from '../shared/other-helper';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { UnitCreateDto } from './dto/create-unit.dto';
import { UnitUpdateDto } from './dto/update-unit.dto';
import { UnitEntity } from './unit.entity';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(UnitEntity)
    private readonly unitRepository: Repository<UnitEntity>
  ) {}

  //create
  async create(data: UnitCreateDto, id: number): Promise<UnitEntity> {
    const newData = new UnitEntity();

    newData.slug = slugify('unit');
    newData.user_id = id;
    newData.name = data.name;
    newData.status = data.status;

    const saveData = await this.unitRepository.save(newData);

    return saveData;
  }

  //find all
  async findAll(): Promise<UnitEntity[]> {
    const data = await this.unitRepository.find({
      where: { is_deleted: false },
      order: { id: 'ASC' },
    });

    return data;
  }

  //find One
  async findOne(id: number): Promise<UnitEntity> {
    const data = await this.unitRepository.findOne({
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
  async findByUser(user_id: number): Promise<UnitEntity[]> {
    const data = await this.unitRepository.find({
      where: { is_deleted: false, user_id: user_id },
      order: { created_at: 'DESC' },
    });
    return data;
  }

  //update
  async update(data: UnitUpdateDto): Promise<UnitEntity> {
    let toUpdate = await this.unitRepository.findOne({
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
      toUpdate.slug = slugify('unit');
    }

    toUpdate.updated_at = new Date();

    let update = Object.assign(toUpdate, data);
    return await this.unitRepository.save(update);
  }

  //delete
  async delete(id: number): Promise<UnitEntity> {
    let toDelete = await this.unitRepository.findOne({
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
    return await this.unitRepository.save(deleted);
  }
}
