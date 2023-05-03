import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavouriteEntity } from './favourite.entity';
import { Repository } from 'typeorm';
import { FavCreateDto } from './dto/fav-create.dto';
import { slugify } from '../shared/other-helper';
import { ProductEntity } from '../product/product.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { HistoryEntity } from '../history/history.entity';

@Injectable()
export class FavouriteService {
  constructor(
    @InjectRepository(FavouriteEntity)
    private readonly favRepository: Repository<FavouriteEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(HistoryEntity)
    private readonly historyRepository: Repository<HistoryEntity>
  ) {}

  //create
  async create(data: FavCreateDto, user_id: number): Promise<FavouriteEntity> {
    const check = await this.favRepository.findOne({
      where: { user_id: user_id, product: { id: data.product } },
    });

    if (check) {
      throw new HttpException(
        {
          msg: 'Product Already Favourite',
          errors: { msg: 'Product Already Favourite' },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const product = await this.productRepository.findOne({
      where: { id: data.product },
    });

    const newData = new FavouriteEntity();
    newData.slug = slugify('fav');
    newData.user_id = user_id;
    newData.product = product;

    const saveData = await this.favRepository.save(newData);

    const history = new HistoryEntity();
    history.slug = slugify('history');
    history.user_id = user_id;
    history.fav = saveData;
    history.message = 'Fav product Created';
    await this.historyRepository.save(history);

    return saveData;
  }

  //find my fav
  async findmyFav(id: number): Promise<FavouriteEntity[]> {
    const data = await this.favRepository.find({
      where: { user_id: id, is_deleted: false },
    });

    return data;
  }

  //delete with id
  async deleteId(id: number): Promise<any> {
    const hisData = await this.historyRepository.findOne({
      where: { fav: { id: id } },
    });
    const his = Object.assign(hisData, { fav: null });
    await this.historyRepository.save(his);

    return await this.favRepository.delete({ id: id });
  }
}
