import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { CompanyEntity } from './company.entity';
import { Repository } from 'typeorm';
import { CompanyUpdateDto } from './dto/update.dto';
import { CompanyCreateDto } from './dto/create.dto';
import { slugify } from '../shared/other-helper';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>
  ) {}

  //Get all company
  async all(): Promise<CompanyEntity[]> {
    let data = await this.companyRepository.find({
      where: { is_deleted: false },
    });

    return data;
  }

  //Get own company
  async ownCompany(id: number): Promise<CompanyEntity> {
    let data = await this.companyRepository.findOne({
      where: { is_deleted: false, user: id },
    });

    return data;
  }

  //Get single company
  async single(id: number): Promise<CompanyEntity> {
    let data = await this.companyRepository.findOne({
      where: { id: id, is_deleted: false },
    });

    return data;
  }

  //update admin
  async update(data: CompanyUpdateDto): Promise<CompanyEntity> {
    let toUpdate = await this.companyRepository.findOne({
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
      toUpdate.slug = slugify('company');
    }

    toUpdate.updated_at = new Date();

    let update = Object.assign(toUpdate, data);
    return await this.companyRepository.save(update);
  }

  // update by user
  async updateByUser(
    data: CompanyCreateDto,
    id: number
  ): Promise<CompanyEntity> {
    let toUpdate = await this.companyRepository.findOne({
      where: { user_id: id, is_deleted: false },
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
      toUpdate.slug = slugify('company');
    }

    toUpdate.updated_at = new Date();

    let update = Object.assign(toUpdate, data);
    return await this.companyRepository.save(update);
  }

  // delete
  async delete(id: number): Promise<CompanyEntity> {
    let toDelete = await this.companyRepository.findOne({
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
    return await this.companyRepository.save(deleted);
  }
}
