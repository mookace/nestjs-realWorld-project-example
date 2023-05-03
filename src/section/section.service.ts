import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { slugify } from '../shared/other-helper';
import { SectionEntity } from './section.entity';
import { SectionCreateDto } from './dto/create.dto';
import { SectionUpdateDto } from './dto/update.dto';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(SectionEntity)
    private readonly sectionRepository: Repository<SectionEntity>
  ) {}

  //create
  async create(data: SectionCreateDto, id: number): Promise<SectionEntity> {
    const newData = new SectionEntity();
    newData.slug = slugify(data.name);
    newData.user_id = id;
    newData.name = data.name;
    newData.image = data.image;
    newData.values = data.values;
    newData.status = data.status;

    const saveData = await this.sectionRepository.save(newData);

    return saveData;
  }

  //find all
  async findAll(): Promise<SectionEntity[]> {
    const data = await this.sectionRepository.find({
      where: { is_deleted: false },
    });

    return data;
  }

  //find one
  async findOne(id: number): Promise<SectionEntity> {
    const data = await this.sectionRepository.findOne({
      where: { id: id, is_deleted: false },
    });

    return data;
  }

  // Update Id
  async updateId(dto: SectionUpdateDto): Promise<SectionEntity> {
    let toUpdate = await this.sectionRepository.findOne({
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
    return await this.sectionRepository.save(updated);
  }

  // delete with id
  async deleteId(id: number): Promise<SectionEntity> {
    let toDelete = await this.sectionRepository.findOne({
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
    return await this.sectionRepository.save(deleted);
  }
}
