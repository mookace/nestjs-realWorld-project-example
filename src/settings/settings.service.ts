import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { SettingEntity } from './settings.entity';
import { SettingCreateDto } from './dto/create.dto';
import { SettingUpdateDto } from './dto/update.dto';
import { slugify } from '../shared/other-helper';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingRepository: Repository<SettingEntity>
  ) {}

  async create(
    user_id: number,
    createData: SettingCreateDto
  ): Promise<SettingEntity> {
    const newData = new SettingEntity();

    newData.user_id = user_id;
    newData.value = createData.value;
    newData.name = createData.name;
    newData.status = createData.status;

    const savenewData = await this.settingRepository.save(newData);
    return savenewData;
  }

  async findAll(): Promise<SettingEntity[]> {
    return await this.settingRepository.find({
      where: { is_deleted: false },
      order: { created_at: 'ASC' },
    });
  }

  async findOne(id: number): Promise<SettingEntity> {
    const data = await this.settingRepository.findOne({
      where: { id: id, is_deleted: false },
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

  async findByName(name: string): Promise<SettingEntity[]> {
    const data = await this.settingRepository.find({
      where: {
        name: Raw((alias) => `${alias} ILIKE '%${name}%'`),
        is_deleted: false,
      },

      order: { created_at: 'ASC' },
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

  //update settings
  async update(data: SettingUpdateDto): Promise<SettingEntity> {
    let toUpdate = await this.settingRepository.findOne({
      where: { id: data.id, is_deleted: false },
    });

    if (!toUpdate) {
      throw new HttpException(
        {
          msg: 'No Image Found',
          errors: { msg: `No Image Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    if (!toUpdate.slug) {
      toUpdate.slug = slugify('settings');
    }

    toUpdate.updated_at = new Date();
    const saveData = Object.assign(toUpdate, data);

    return await this.settingRepository.save(saveData);
  }

  //delete
  async delete(id: number): Promise<SettingEntity> {
    let toDelete = await this.settingRepository.findOne({
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
    return await this.settingRepository.save(deleted);
  }
}
