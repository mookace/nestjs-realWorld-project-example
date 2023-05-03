import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerEntity } from './banner.entity';
import { Repository } from 'typeorm';
import { BannerDto } from './dto/create.dto';
import { slugify } from '../shared/other-helper';
import { BannerUpdateIdDto } from './dto/updateId.dto';
import { DeleteIdDto } from '../shared/dto/delete-id.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepository: Repository<BannerEntity>
  ) {}

  async findAllImage(): Promise<BannerEntity[]> {
    return await this.bannerRepository.find({
      where: { is_deleted: false },
      order: { created_at: 'ASC' },
    });
  }

  async findImageById(id: number): Promise<BannerEntity> {
    const data = await this.bannerRepository.findOne({
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

  async findByUser(user_id: number): Promise<BannerEntity[]> {
    const data = await this.bannerRepository.find({
      where: { user_id: user_id, is_deleted: false },
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

  async createImage(
    user_id: number,
    createImage: BannerDto,
    imageURL: string,
    filename: string
  ): Promise<BannerEntity> {
    const newData = new BannerEntity();
    newData.slug = slugify(filename);
    newData.user_id = user_id;
    newData.is_main = createImage.is_main;
    newData.name = imageURL;
    newData.status = createImage.status;

    const savenewData = await this.bannerRepository.save(newData);
    return savenewData;
  }

  // update with Id
  async updateImageById(data: BannerUpdateIdDto): Promise<BannerEntity> {
    let toUpdate = await this.bannerRepository.findOne({
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
      toUpdate.slug = slugify('banner');
    }
    toUpdate.updated_at = new Date();
    toUpdate.is_main = data.is_main;

    return await this.bannerRepository.save(toUpdate);
  }

  //delete with id
  async deleteImageId(id: number): Promise<BannerEntity> {
    let toDelete = await this.bannerRepository.findOne({
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
    return await this.bannerRepository.save(deleted);
  }
}
