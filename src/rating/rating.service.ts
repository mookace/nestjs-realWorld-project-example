import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { slugify } from '../shared/other-helper';
import { RatingEntity } from './rating.entity';
import { ratingCreateDto } from './dto/create.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>
  ) {}

  //create
  async create(data: ratingCreateDto, id: number): Promise<RatingEntity> {
    const findRating = await this.ratingRepository.findOne({
      where: { user_id: id, product_id: data.product_id, is_deleted: false },
    });
    if (findRating) {
      findRating.updated_at = new Date();
      let update = Object.assign(findRating, data);
      return await this.ratingRepository.save(update);
    }

    const newData = new RatingEntity();
    newData.slug = slugify('rating');
    newData.user_id = id;
    newData.product_id = data.product_id;
    newData.rating = data.rating;

    const saveData = await this.ratingRepository.save(newData);

    return saveData;
  }

  //find all
  async findAll(): Promise<RatingEntity[]> {
    const data = await this.ratingRepository.find({
      where: { is_deleted: false },
    });

    return data;
  }

  //find By Product Id
  async FindByProductId(id: number): Promise<RatingEntity[]> {
    const data = await this.ratingRepository.find({
      where: { is_deleted: false, product_id: id },
    });

    return data;
  }
}
