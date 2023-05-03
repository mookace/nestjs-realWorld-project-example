import {
  Get,
  Post,
  Body,
  Param,
  Controller,
  UsePipes,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';

import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto';
import { InsertImageDto } from './dto/create-image.dto';
import { DeleteImageDto } from './dto/delete-image.dto';
import { ProductEntity } from './product.entity';
import { Request } from 'express';
import { User } from '../shared/user.decorator';
import { ProductUpdateDto } from './dto/update.dto';

@ApiBearerAuth()
@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //Test Pagination
  @Get('all')
  async findAllProducts(@Req() req: Request): Promise<{ msg; data; status }> {
    const data = await this.productService.findAll(req);
    return { msg: 'Get All Products Successfully', data, status: 'success' };
  }

  //Recommendation
  @Get('recommendation')
  async findAllProductsRecommended(): Promise<{ msg; data; status }> {
    const data = await this.productService.findRecommended();
    return { msg: 'Get All Products Successfully', data, status: 'success' };
  }

  //Find By Product Name
  @Get('name/:product_name')
  async findProduct(
    @Req() req: Request,
    @Param('product_name') product_name: string
  ): Promise<{ msg; data; status }> {
    const data = await this.productService.findByProductName(product_name, req);
    return { msg: 'Get Product Successfully', data, status: 'success' };
  }
  //Find By Product Id
  @Get('prdbyId/:id')
  async findOneProductById(
    @Req() req: Request,
    @Param('id') id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.productService.findProductById(id);
    return { msg: 'Get Product Successfully', data, status: 'success' };
  }

  //Get Product By Brand Id
  @Get('brand/:id')
  async findProductByBrand(
    @Param('id') id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.productService.findProductByBrand(id);
    return { msg: 'Get Product Brand Successfully', data, status: 'success' };
  }

  //Get Product By Category Id
  @Get('search-category')
  async findByCategory(
    @Query('sub_sub_cat') sub_sub_cat: number | null | undefined,
    @Query('sub_cat') sub_cat: number,
    @Query('cat') cat: number
  ): Promise<{ msg; data; status }> {
    const data = await this.productService.findByCategory(
      cat,
      sub_cat,
      sub_sub_cat
    );
    return {
      msg: 'Get Product Category Successfully',
      data,
      status: 'success',
    };
  }

  //get product by id
  @Get('product-slug/:id')
  async findProductById(
    @Param('id') id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.productService.FindById(id);
    return { msg: 'Get Product Successfully', data, status: 'success' };
  }

  //Create
  @UsePipes(new ValidationPipe())
  @Post('create')
  async createProduct(
    @User('id') id: number,
    @Body() productData: CreateProductDto
  ): Promise<{ msg; data; status }> {
    const data = await this.productService.create(id, productData);
    return {
      msg: 'Product Created Successfully',
      data: data,
      status: 'success',
    };
  }

  //Insert Image into Product with slug
  @UsePipes(new ValidationPipe())
  @Post('create-image/:product_slug')
  async createImage(
    @Param('product_slug') product_slug: string,
    @Body() imageData: InsertImageDto
  ): Promise<{ msg; data; status }> {
    const data = await this.productService.InsertImage(product_slug, imageData);
    return {
      msg: 'Product Image Uploaded Successfully',
      data: data,
      status: 'success',
    };
  }

  //Insert Image into Product with id
  @UsePipes(new ValidationPipe())
  @Post('create-image-product/:id')
  async createImageProduct(
    @Param('id') id: number,
    @Body() imageData: InsertImageDto
  ): Promise<{ msg; data; status }> {
    const data = await this.productService.InsertImageProduct(id, imageData);
    return {
      msg: 'Product Image Uploaded Successfully',
      data: data,
      status: 'success',
    };
  }

  //Delete product image form product
  @UsePipes(new ValidationPipe())
  @Post('delete-image')
  async deleteImage(
    @Body() imageData: DeleteImageDto
  ): Promise<{ msg; data; status }> {
    const data = await this.productService.DeleteImage(imageData);
    return {
      msg: 'Product Image Deleted Successfully',
      data: data,
      status: 'success',
    };
  }

  // Update Product with slug or id
  @UsePipes(new ValidationPipe())
  @Post('update')
  async updateProduct(
    @Body() productData: ProductUpdateDto
  ): Promise<{ msg; data; status }> {
    const data = await this.productService.updateProductId(productData);
    return { msg: 'Product Updated Successfully', data, status: 'success' };
  }

  // Delete Section with id
  @Post('delete-id')
  async deleteProductId(
    @Body('id') id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.productService.deleteProductId(id);
    return { msg: 'Product Deleted Successfully', data, status: 'success' };
  }

  // Total no. of product
  @Get('total-product')
  async totalProduct(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.productService.totalProduct(id);
    return { msg: 'Get Total Product Successfully', data, status: 'success' };
  }
}
