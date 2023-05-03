import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Like, Repository } from 'typeorm';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { validate } from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto';
import { Pagination, slugify } from '../shared/other-helper';
import { ProductImageEntity } from '../product-images/product-images.entity';
import { InsertImageDto } from './dto/create-image.dto';
import { CompanyEntity } from '../company/company.entity';
import { DeleteImageDto } from './dto/delete-image.dto';
import { UserEntity } from '../user/user.entity';
import { ProductUpdateDto } from './dto/update.dto';
import { ColourEntity } from '../colour/colour.entity';
import { SizeEntity } from '../size/size.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,
    @InjectRepository(ColourEntity)
    private readonly colourRepository: Repository<ColourEntity>,
    @InjectRepository(SizeEntity)
    private readonly sizeRepository: Repository<SizeEntity>
  ) {}

  //Find all Product
  async findAll(req: any): Promise<{ data: ProductEntity[]; page }> {
    const data = await Pagination(req, this.productRepository, null, {
      id: 'DESC',
    });

    return data;
  }

  //Recommend Product
  async findRecommended(): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      where: { is_deleted: false },
      take: 12,
    });
  }

  //Find single Product by id
  async FindById(id: number): Promise<{ product; company; avgRating }> {
    const product = await this.productRepository.findOne({
      where: { id: id, is_deleted: false },
    });

    if (!product) {
      throw new HttpException(
        {
          msg: 'No Data Found',
          errors: { msg: 'No Data Found' },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const company = await this.companyRepository.findOne({
      where: { user: product.user_id, is_deleted: false },
    });

    let sum = 0;
    let count = product.rating.length;
    for (let i = 0; i < product.rating.length; i++) {
      sum = parseFloat(product.rating[i].rating) + sum;
    }

    const avg = sum / count;

    if (!company) {
      return { product: product, company: null, avgRating: avg };
    }
    return { product: product, company: company, avgRating: avg };
  }

  //Create new Product
  async create(
    id: number,
    productData: CreateProductDto
  ): Promise<ProductEntity> {
    const [product, count] = await this.productRepository.findAndCount({
      where: { user_id: id, is_deleted: false },
    });

    const vendorData = await this.userRepository.findOne({
      where: { id: id, is_deleted: false },
    });

    if (vendorData.service == 0) {
      if (count >= 2) {
        throw new HttpException(
          {
            msg: 'Only 2 Product Can Create',
            errors: { msg: `Only 2 Product Can Create` },
            status: 'errors',
          },
          HttpStatus.BAD_REQUEST
        );
      }
    }

    let newProduct = new ProductEntity();
    newProduct.slug = slugify(productData.name);
    newProduct.name = productData.name;
    newProduct.user_id = id;
    newProduct.location = productData.location;
    newProduct.unit = productData.unit;
    newProduct.main_image = productData.main_image;
    newProduct.model_no = productData.model_no;
    newProduct.gaurantee = productData.gaurantee;
    newProduct.delivery_time = productData.delivery_time;
    newProduct.size_available = JSON.stringify(productData.size_available);
    newProduct.colour_available = JSON.stringify(productData.colour_available);

    newProduct.sub_unit = productData.sub_unit;
    newProduct.per_unit_qty = productData.per_unit_qty;
    newProduct.quantity = productData.quantity;
    newProduct.price = productData.price;
    newProduct.description = productData.description;
    newProduct.attributes = productData.attributes;
    newProduct.features = productData.features;
    newProduct.specification = productData.specification;
    newProduct.brand = productData.brand;
    newProduct.cat = productData.cat;
    newProduct.sub_cat = productData.sub_cat;
    newProduct.sub_sub_cat = productData.sub_sub_cat;
    newProduct.product_images = [];

    newProduct.min_price = productData.min_price;
    newProduct.max_price = productData.max_price;
    newProduct.wholesale_price_type = productData.wholesale_price_type;
    newProduct.production_capacity = productData.production_capacity;
    newProduct.product_service_code = productData.product_service_code;
    newProduct.sale_type = productData.sale_type;
    newProduct.wholesale_image = productData.wholesale_image;
    if (productData.sale_type == 1) {
      // const tring = JSON.stringify([
      //   'http://localhost:3000/productimage/ca6137793c933a704e7a1618592f6e4a.jpg',
      //   'http://localhost:3000/productimage/d440a8538fa2ce10cff9066e9216bc493.jpg',
      // ]);

      const image_data = JSON.parse(productData.wholesale_image)[0];
      newProduct.main_image = JSON.stringify(image_data);
    }

    const errors = await validate(newProduct);
    if (errors.length > 0) {
      throw new HttpException(
        {
          msg: 'Input data validation failed',
          errors: { msg: `Product input is not valid.` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    } else {
      const saveData = await this.productRepository.save(newProduct);
      return saveData;
    }
  }

  //Insert image into product
  async InsertImage(
    slug: string, //product slug
    image: InsertImageDto //image id
  ): Promise<ProductEntity> {
    let toUpdate = await this.productRepository.findOne({
      where: { slug: slug, is_deleted: false },
    });

    if (!toUpdate) {
      throw new HttpException(
        {
          msg: 'No Product Found',
          errors: { msg: `No Product Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    if (!toUpdate.slug) {
      toUpdate.slug = slugify('product');
    }

    const imageData = await this.productImageRepository.findOne({
      where: { id: image.image_id, is_deleted: false },
    });
    if (imageData.is_image_main == 1) {
      toUpdate.main_image = imageData.name;
      return await this.productRepository.save(toUpdate);
    }

    toUpdate.product_images.push(imageData);

    return await this.productRepository.save(toUpdate);
  }

  //Insert image into product with product id
  async InsertImageProduct(
    id: number, //product id
    image: InsertImageDto //image id
  ): Promise<ProductEntity> {
    let toUpdate = await this.productRepository.findOne({
      where: { id: id, is_deleted: false },
    });

    if (!toUpdate) {
      throw new HttpException(
        {
          msg: 'No Product Found',
          errors: { msg: `No Product Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    if (!toUpdate.slug) {
      toUpdate.slug = slugify('product');
    }
    const imageData = await this.productImageRepository.findOne({
      where: { id: image.image_id, is_deleted: false },
    });
    if (imageData.is_image_main == 1) {
      toUpdate.main_image = imageData.name;
      return await this.productRepository.save(toUpdate);
    }

    toUpdate.product_images.push(imageData);

    return await this.productRepository.save(toUpdate);
  }

  //Delete Product Image
  async DeleteImage(data: DeleteImageDto): Promise<ProductEntity> {
    const imageData = await this.productImageRepository.findOne({
      where: {
        id: data.image_id,
        product: { id: data.product_id },
        is_deleted: false,
      },
    });

    imageData.product = null;
    await this.productImageRepository.save(imageData);

    const productData = await this.productRepository.findOne({
      where: { id: data.product_id, is_deleted: false },
    });

    return productData;
  }

  //update product with id
  async updateProductId(dto: ProductUpdateDto): Promise<ProductEntity> {
    let toUpdate = await this.productRepository.findOne({
      where: { id: dto.id, is_deleted: false },
    });

    if (!toUpdate) {
      throw new HttpException(
        {
          msg: 'No Product Found',
          errors: { msg: `No Product Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    toUpdate.updated_at = new Date();

    let updated = Object.assign(toUpdate, dto);
    return await this.productRepository.save(updated);
  }

  // delete with id
  async deleteProductId(id: number): Promise<ProductEntity> {
    let toDelete = await this.productRepository.findOne({
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

    //delete size
    await this.sizeRepository
      .createQueryBuilder('size')
      .update(SizeEntity)
      .set({
        colour: null,
        product_id: null,
        is_deleted: true,
        deleted_at: new Date(),
      })
      .where('product_id = :product_id', { product_id: id })
      .execute();

    //delete colour
    await this.colourRepository
      .createQueryBuilder('colour')
      .update(ColourEntity)
      .set({
        product_id: null,
        is_deleted: true,
        deleted_at: new Date(),
      })
      .where('product_id = :product_id', { product_id: id })
      .execute();

    return await this.productRepository.save(deleted);
  }

  async totalProduct(id: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: id, is_deleted: false },
    });

    if (user.roles == 1) {
      let [data, count] = await this.productRepository.findAndCount({
        where: { is_deleted: false },
      });
      return count;
    } else if (user.roles == 2) {
      let [data, count] = await this.productRepository.findAndCount({
        where: { user_id: id, is_deleted: false },
      });
      return count;
    } else {
      throw new HttpException(
        {
          msg: 'Unauthorized.',
          errors: { msg: 'Unauthorized.' },
          status: 'errors',
        },
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  //find by product name
  async findByProductName(
    productName: string,
    req: any
  ): Promise<{ data: ProductEntity[]; page: number }> {
    const data = await Pagination(
      req,
      this.productRepository,
      { name: Like(`%${productName}%`) },
      { created_at: 'DESC' }
    );
    if ((await data).data.length == 0) {
      throw new HttpException(
        {
          msg: 'No Data Found',
          errors: { msg: 'No Data Found' },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    return data;
  }

  // find cat
  async findByCategory(
    cat: number,
    sub_cat: number,
    sub_sub_cat: number | null | undefined
  ): Promise<ProductEntity[]> {
    if (!sub_sub_cat) {
      const data = await this.productRepository.find({
        where: {
          is_deleted: false,
          cat: { id: cat },
          sub_cat: { id: sub_cat },
        },
      });
      if (data.length == 0) {
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

    const data = await this.productRepository.find({
      where: {
        is_deleted: false,
        cat: { id: cat },
        sub_cat: { id: sub_cat },
        sub_sub_cat: { id: sub_sub_cat },
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

  // find by brand
  async findProductByBrand(id: number): Promise<ProductEntity[]> {
    const data = await this.productRepository.find({
      where: { is_deleted: false, brand: { id: id } },
      order: { created_at: 'DESC' },
    });

    if (!data) {
      throw new HttpException(
        {
          msg: 'Data Not Found',
          errors: { msg: `No Data Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    return data;
  }

  // find by Id
  async findProductById(ID: number): Promise<ProductEntity> {
    const data = await this.productRepository.findOne({
      where: { is_deleted: false, id: ID },
      order: { created_at: 'DESC' },
    });

    if (!data) {
      throw new HttpException(
        {
          msg: 'Data Not Found',
          errors: { msg: `No Data Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    return data;
  }
}
