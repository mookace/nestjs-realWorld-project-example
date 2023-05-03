import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { slugify } from '../shared/other-helper';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { ProductEntity } from '../product/product.entity';
import { BrandEntity } from './brand.entity';
import { BrandDto } from './dto/brand.dto';
import { BrandUpdateIdDto } from './dto/updateId.dto';
import { DeleteIdDto } from '../shared/dto/delete-id.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>
  ) {}

  async create(data: BrandDto, user_id: number): Promise<BrandEntity> {
    const newBrand = new BrandEntity();

    newBrand.slug = slugify(data.name);
    newBrand.name = data.name;
    newBrand.user_id = user_id;
    newBrand.description = data.description;
    newBrand.image = data.image;
    newBrand.status = data.status;

    const saveData = await this.brandRepository.save(newBrand);

    return saveData;
  }

  async findAll(): Promise<BrandEntity[]> {
    return await this.brandRepository.find({
      where: { is_deleted: false },
      order: { id: 'ASC' },
    });
  }

  // find by vendor_id
  async ByUser(vendor_id: number): Promise<BrandEntity[]> {
    return await this.brandRepository.find({
      where: { is_deleted: false, user_id: vendor_id },
    });
  }

  // Find brand by Id
  async findBrandById(id: number): Promise<BrandEntity> {
    const data = await this.brandRepository.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
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

  // Update Id
  async updateId(dto: BrandUpdateIdDto): Promise<BrandEntity> {
    let toUpdate = await this.brandRepository.findOne({
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
    if (!toUpdate.slug) {
      toUpdate.slug = slugify(toUpdate.name);
    }

    let updated = Object.assign(toUpdate, dto);
    return await this.brandRepository.save(updated);
  }

  // delete with id
  async deleteId(id: number): Promise<BrandEntity> {
    let toDelete = await this.brandRepository.findOne({
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
    return await this.brandRepository.save(deleted);
  }
}
