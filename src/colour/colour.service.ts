import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { slugify } from '../shared/other-helper';
import { ProductEntity } from '../product/product.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { ColorCreateIdDto } from './dto/create.dto';
import { ColourEntity } from './colour.entity';
import { SizeEntity } from '../size/size.entity';

@Injectable()
export class ColourService {
  constructor(
    @InjectRepository(ColourEntity)
    private readonly colourRepository: Repository<ColourEntity>,
    @InjectRepository(SizeEntity)
    private readonly sizeRepository: Repository<SizeEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {}

  //create and update colour variation with Id
  async createId(
    created_data: ColorCreateIdDto[],
    id: number
  ): Promise<string> {
    for (let i = 0; i < created_data.length; i++) {
      //update colour variation
      if (created_data[i].id) {
        let toUpdate = await this.colourRepository.findOne({
          where: { id: created_data[i].id, is_deleted: false },
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

        toUpdate.updated_at = new Date();

        let updated = Object.assign(toUpdate, created_data[i]);
        await this.colourRepository.save(updated);
      } else {
        //create new colour variation

        const color = new ColourEntity();
        color.user_id = id;
        color.colour = created_data[i].colour;
        color.price = created_data[i].price;
        color.is_image_main = created_data[i].is_image_main;
        color.image = created_data[i].image;
        color.quantity = created_data[i].quantity;
        color.slug = slugify(created_data[i].colour);
        color.size = [];
        color.product_id = created_data[i].product_id;

        const product = await this.productRepository.findOne({
          where: { id: created_data[i].product_id, is_deleted: false },
        });
        if (!product) {
          throw new HttpException(
            {
              msg: 'No Product Found',
              errors: { msg: 'No Product Found' },
              status: 'errors',
            },
            HttpStatus.BAD_REQUEST
          );
        }
        product.colour = 1;
        await this.productRepository.save(product);
        await this.colourRepository.save(color);
      }
    }

    return 'Colour Variation Created and Updated Success';
  }

  //find all
  async findAll(): Promise<ColourEntity[]> {
    return await this.colourRepository.find({
      relations: ['size'],
      where: { is_deleted: false },
      order: { created_at: 'DESC' },
    });
  }

  //FInd colour by id
  async findById(id: number): Promise<ColourEntity> {
    const data = await this.colourRepository.findOne({
      relations: ['size'],
      where: {
        is_deleted: false,
        id: id,
      },
    });
    if (!data) {
      throw new HttpException(
        {
          msg: 'Data Not Found',
          errors: { msg: `Data Not Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }
    return data;
  }

  //find colour by product id
  async findByProduct(id: number): Promise<ColourEntity[]> {
    const data = await this.colourRepository.find({
      relations: ['size'],
      where: {
        is_deleted: false,
        product_id: id,
      },
      order: {
        created_at: 'DESC',
      },
    });

    return data;
  }

  //delete with Id
  async deleteId(id: number): Promise<ColourEntity> {
    let toDelete = await this.colourRepository.findOne({
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

    await this.sizeRepository
      .createQueryBuilder('size')
      .leftJoinAndSelect('size.colour', 'colour')
      .update(SizeEntity)
      .set({ colour: null, product_id: null, is_deleted: true })
      .where('colour.id = :colour', { colour: 2 })
      .execute();

    let deleted = Object.assign(toDelete, {
      is_deleted: true,
      deleted_at: new Date(),
    });
    return await this.colourRepository.save(deleted);
  }
}
