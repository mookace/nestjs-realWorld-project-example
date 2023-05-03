import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { slugify } from '../shared/other-helper';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { BlogEntity } from './blog.entity';
import { BlogCreateDto } from './dto/create.dto';
import { BlogUpdateIdDto } from './dto/updateId.dto';
@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>
  ) {}

  //create
  async create(data: BlogCreateDto, id: number): Promise<BlogEntity> {
    const newData = new BlogEntity();

    newData.slug = slugify(data.title);
    newData.user_id = id;
    newData.title = data.title;
    newData.body = data.body;
    newData.image = data.image;
    newData.status = data.status;

    const saveData = await this.blogRepository.save(newData);

    return saveData;
  }

  //find all
  async findAll(): Promise<BlogEntity[]> {
    const data = await this.blogRepository.find({
      where: { is_deleted: false },
    });

    return data;
  }

  //find One
  async findOne(id: number): Promise<BlogEntity> {
    const data = await this.blogRepository.findOne({
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
  async findByUser(user_id: number): Promise<BlogEntity[]> {
    const data = await this.blogRepository.find({
      where: { is_deleted: false, user_id: user_id },
      order: { created_at: 'DESC' },
    });
    return data;
  }

  //update Id
  async updateId(data: BlogUpdateIdDto): Promise<BlogEntity> {
    let toUpdate = await this.blogRepository.findOne({
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
      toUpdate.slug = slugify('blog');
    }

    toUpdate.updated_at = new Date();

    let update = Object.assign(toUpdate, data);
    return await this.blogRepository.save(update);
  }

  //delete Id
  async deleteId(id: number): Promise<BlogEntity> {
    let toDelete = await this.blogRepository.findOne({
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
    return await this.blogRepository.save(deleted);
  }
}
