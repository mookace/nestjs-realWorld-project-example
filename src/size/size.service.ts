import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { slugify } from '../shared/other-helper';
import { ProductEntity } from '../product/product.entity';
import { SizeEntity } from './size.entity';
import { ColourEntity } from '../colour/colour.entity';
import { CreateSizeDto } from './dto/create.dto';
import { SizeUpdateDto } from './dto/update.dto';

@Injectable()
export class SizeService {
  constructor(
    @InjectRepository(SizeEntity)
    private readonly sizeRepository: Repository<SizeEntity>,
    @InjectRepository(ColourEntity)
    private readonly colourRepository: Repository<ColourEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {}

  //Create
  async create(
    created_data: CreateSizeDto[],
    user_id: number
  ): Promise<string> {
    for (let i = 0; i < created_data.length; i++) {
      const sizeData = new SizeEntity();
      sizeData.slug = slugify('size');
      sizeData.user_id = user_id;
      sizeData.size = created_data[i].size;
      sizeData.quantity = created_data[i].quantity;
      sizeData.price = created_data[i].price;
      sizeData.regular_price = created_data[i].regular_price;
      sizeData.discount_status = created_data[i].discount_status;
      sizeData.discount = created_data[i].discount;
      sizeData.discount_type = created_data[i].discount_type;
      sizeData.status = created_data[i].status;

      const colour = await this.colourRepository.findOne({
        relations: ['size'],
        where: { id: created_data[i].colour_id },
      });

      if (!colour) {
        throw new HttpException(
          {
            msg: `Colour id=${created_data[i].colour_id} Not Found`,
            errors: { msg: `Colour id=${created_data[i].colour_id} Not Found` },
            status: 'errors',
          },
          HttpStatus.BAD_REQUEST
        );
      }

      sizeData.product_id = colour.product_id;
      const saveData = await this.sizeRepository.save(sizeData);

      colour.size.push(saveData);
      await this.colourRepository.save(colour);
    }

    return 'Size Variation Create Success';
  }

  //update with Id
  async updateId(updateData: SizeUpdateDto[]): Promise<SizeEntity[]> {
    let allData = [];
    for (let i = 0; i < updateData.length; i++) {
      const toUpdate = await this.sizeRepository.findOne({
        where: { id: updateData[i].id, is_deleted: false },
      });

      if (!toUpdate) {
        throw new HttpException(
          {
            msg: 'Data Not Found',
            errors: { msg: 'Data Not Found' },
            status: 'errors',
          },
          HttpStatus.BAD_REQUEST
        );
      }

      const colour = await this.colourRepository.findOne({
        relations: ['size'],
        where: { id: updateData[i].colour_id, is_deleted: false },
      });

      if (!colour) {
        throw new HttpException(
          {
            msg: 'Colour Variation Not Found',
            errors: { msg: `Colour Variation Not Found` },
            status: 'errors',
          },
          HttpStatus.BAD_REQUEST
        );
      }

      toUpdate.updated_at = new Date();
      delete toUpdate.colour;
      delete updateData[i].colour_id;
      toUpdate.product_id = colour.product_id;
      const update = Object.assign(toUpdate, updateData[i]);

      const saveData = await this.sizeRepository.save(update);

      colour.size.push(saveData);
      await this.colourRepository.save(colour);
      allData.push(saveData);
    }

    return allData;
  }

  //Find Product By Price range
  async findByPrice(min: number, max: number): Promise<ProductEntity[]> {
    const data = await this.sizeRepository.find({
      where: { is_deleted: false, price: Between(min, max) },
      order: { price: 'ASC' },
    });

    const products = data.map((x) => x.product_id);
    const product_id = [...new Set(products)];
    let allProduct = [];

    for (let i = 0; i < product_id.length; i++) {
      const productData = await this.productRepository.findOne({
        where: { id: product_id[i], colour: 1, is_deleted: false },
      });

      allProduct.push(productData);
    }

    return allProduct;
  }

  //find by Product id
  async ProductId(id: number): Promise<SizeEntity[]> {
    return await this.sizeRepository.find({
      relations: ['colour'],
      where: { is_deleted: false, product_id: id },
      order: { id: 'ASC' },
    });
  }

  //find By colour id
  async findByColourId(id: number): Promise<SizeEntity[]> {
    return await this.sizeRepository.find({
      relations: ['colour'],
      where: { is_deleted: false, colour: { id: id } },
      order: { id: 'ASC' },
    });
  }

  //get single size with id
  async findOneSize(id: number): Promise<SizeEntity> {
    const data = await this.sizeRepository.findOne({
      where: {
        id: id,
        is_deleted: false,
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

  //delete with id
  async deleteId(id: number): Promise<SizeEntity> {
    const toDelete = await this.sizeRepository.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
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
    return await this.sizeRepository.save(deleted);
  }
}
