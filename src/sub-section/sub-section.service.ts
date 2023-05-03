import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { slugify } from '../shared/other-helper';
import { SubSectionEntity } from './sub-section.entity';
import { SubSectionCreateDto } from './dto/create.dto';
import { SubSectionUpdateDto } from './dto/update.dto';
import { SectionEntity } from '../section/section.entity';

@Injectable()
export class SubSectionService {
  constructor(
    @InjectRepository(SectionEntity)
    private readonly sectionRepository: Repository<SectionEntity>,
    @InjectRepository(SubSectionEntity)
    private readonly subSectionRepository: Repository<SubSectionEntity>
  ) {}

  //create
  async create(
    data: SubSectionCreateDto,
    id: number
  ): Promise<SubSectionEntity> {
    const sectionData = await this.sectionRepository.findOne({
      where: { id: data.section_id },
    });

    const newData = new SubSectionEntity();
    newData.slug = slugify(data.name);
    newData.user_id = id;
    newData.name = data.name;
    newData.image = data.image;
    newData.values = data.values;
    newData.status = data.status;
    newData.section_id = sectionData;

    const saveData = await this.subSectionRepository.save(newData);

    return saveData;
  }

  //find all
  async findAll(): Promise<SubSectionEntity[]> {
    const data = await this.subSectionRepository.find({
      relations: ['section_id'],
      where: { is_deleted: false },
      loadRelationIds: true,
    });

    return data;
  }

  //find one
  async findOne(id: number): Promise<SubSectionEntity> {
    const data = await this.subSectionRepository.findOne({
      relations: ['section_id'],
      where: { id: id, is_deleted: false },
      loadRelationIds: true,
    });

    return data;
  }

  // Update Id
  async updateId(dto: SubSectionUpdateDto): Promise<SubSectionEntity> {
    let toUpdate = await this.subSectionRepository.findOne({
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
    return await this.subSectionRepository.save(updated);
  }

  // delete with id
  async deleteId(id: number): Promise<SubSectionEntity> {
    let toDelete = await this.subSectionRepository.findOne({
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
    return await this.subSectionRepository.save(deleted);
  }
}
