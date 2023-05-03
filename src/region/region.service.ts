import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { slugify } from '../shared/other-helper';
import { RegionEntity } from './region.entity';
import { RegionCreateDto } from './dto/create.dto';
import { RegionUpdateDto } from './dto/update.dto';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(RegionEntity)
    private readonly regionRepository: Repository<RegionEntity>
  ) {}

  //create
  async create(data: RegionCreateDto, id: number): Promise<RegionEntity> {
    const newData = new RegionEntity();
    newData.slug = slugify('region');
    newData.user_id = id;
    newData.name = data.name;
    newData.image = data.image;
    newData.status = data.status;

    const saveData = await this.regionRepository.save(newData);

    return saveData;
  }

  //find all
  async findAll(): Promise<RegionEntity[]> {
    const data = await this.regionRepository.find({
      where: { is_deleted: false },
    });

    return data;
  }

  //find one
  async findOne(id: number): Promise<RegionEntity> {
    const data = await this.regionRepository.findOne({
      where: { id: id, is_deleted: false },
    });

    return data;
  }

  // Update Id
  async updateId(dto: RegionUpdateDto): Promise<RegionEntity> {
    let toUpdate = await this.regionRepository.findOne({
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
    return await this.regionRepository.save(updated);
  }

  // delete with id
  async deleteId(id: number): Promise<RegionEntity> {
    let toDelete = await this.regionRepository.findOne({
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
    return await this.regionRepository.save(deleted);
  }
}
