import {
  Get,
  Post,
  Body,
  Param,
  Controller,
  UsePipes,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { CreateCategotyDto } from './dto/create-category.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Query, Req, UseGuards } from '@nestjs/common/decorators';
import { ImageDto } from '../shared/dto/image.dto';
import { CategoryEntity } from './category.entity';
import { CategotyUpdateIdDto } from './dto/updateId.dto';
import { User } from '../shared/user.decorator';

const storage = diskStorage({
  destination: './images/category-image',
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

@ApiBearerAuth()
@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //Get All Category
  @Get('all')
  async AllCategory(): Promise<{ msg; data; status }> {
    const data = await this.categoryService.findAllCategory();
    return { msg: 'Get Category Successfully', data, status: 'success' };
  }

  //Get sub and sub-sub-cat
  @Get('others')
  async OthersCategory(
    @Query('cat') cat: number | null,
    @Query('sub') sub: number | null
  ): Promise<{ msg; data; status }> {
    let data;
    if (sub) {
      data = await this.categoryService.OthersCategory(null, sub);
    } else if (cat) {
      data = await this.categoryService.OthersCategory(cat, null);
    } else {
      data = await this.categoryService.OthersCategory(null, null);
    }
    return { msg: 'Get Category Successfully', data, status: 'success' };
  }

  //Get 3 Popular Category
  @Get('popular-category')
  async PopularCategory(): Promise<{ msg; data; status }> {
    const data = await this.categoryService.popularCategory();
    return {
      msg: 'Get Popular Category Successfully',
      data,
      status: 'success',
    };
  }

  // Get 5 Sub Category only
  @Get('subcat-five')
  async cat5Data(): Promise<{ msg; data; status }> {
    const data = await this.categoryService.findFIveData();
    return { msg: 'Get 5 Sub Category Successfully', data, status: 'success' };
  }

  // Get 8 Category
  @Get('cat-with-eight-subcat')
  async catEightData(): Promise<{ msg; data; status }> {
    const data = await this.categoryService.findEightData();
    return { msg: 'Get Eight Category Successfully', data, status: 'success' };
  }

  // Get User Based Category
  @Get('user-category')
  async UserCategory(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.categoryService.UserCategory(id);
    return { msg: 'Get Category Successfully', data, status: 'success' };
  }

  // Get Cat only
  @Get('category-only')
  async OnlyCategory(): Promise<{ msg; data; status }> {
    const data = await this.categoryService.findCategoryOnly();
    return { msg: 'Get Category Only Successfully', data, status: 'success' };
  }

  //Get sub cat
  @Get('sub-category-only')
  async SubOnlyCategory(): Promise<{ msg; data; status }> {
    const data = await this.categoryService.findSubCategoryOnly();
    return {
      msg: 'Get Sub-Category Only Successfully',
      data,
      status: 'success',
    };
  }

  //Get sub sub cat
  @Get('sub-sub-category-only')
  async SubsubCategoryOnly(): Promise<{ msg; data; status }> {
    const data = await this.categoryService.findSubsubCategoryOnly();
    return {
      msg: 'Get Sub-sub-Category Only Successfully',
      data,
      status: 'success',
    };
  }

  //Get cat by parentId
  @Get('category/:parentid')
  async CategoryByParentId(
    @Param('parentid') parentid: number
  ): Promise<{ msg; data; status }> {
    const data = await this.categoryService.findCategoryByParendId(parentid);
    return { msg: 'Get Category Successfully', data, status: 'success' };
  }

  //Get Cat By Id
  @Get('category-id/:id')
  async CategoryById(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.categoryService.findCategoryById(id);
    return { msg: 'Get Category Successfully', data, status: 'success' };
  }

  //Add Popular category
  @Post('popular-category')
  async CreatePopularCategory(
    @Body('id') id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.categoryService.createPopularCategory(id);
    return {
      msg: 'Popular Category Created Successfully',
      data,
      status: 'success',
    };
  }

  //create category
  @UsePipes(new ValidationPipe())
  @Post('create')
  async createCategory(
    @User('id') id: number,
    @Body() categoryData: CreateCategotyDto
  ): Promise<{ msg; data; status }> {
    const data = await this.categoryService.addCategory(categoryData, id);

    return {
      msg: 'Category Created Successfully',
      data,
      status: 'success',
    };
  }

  //update category id
  @UsePipes(new ValidationPipe())
  @Post('update')
  async updateCategoryId(
    @Body() categoryData: CategotyUpdateIdDto
  ): Promise<{ msg; data; status }> {
    const data = await this.categoryService.updateCategoryId(categoryData);

    return { msg: 'Category Updated Successfully', data, status: 'success' };
  }

  //delete category id
  @UsePipes(new ValidationPipe())
  @Post('delete')
  async deleteCategoryId(
    @Body('id') id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.categoryService.deleteCategoryId(id);
    return { msg: 'Category Deleted Successfully', data, status: 'success' };
  }

  //generate Image url
  @Post('imageurl')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage }))
  async CreateImageUrl(
    @Body() data: ImageDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req: Request
  ): Promise<{ msg; data; status }> {
    const imageURL = `${req.protocol}://${req.get('Host')}/category-image/${
      image.filename
    }`;

    return {
      msg: 'Category Image Uploaded Successfully',
      data: imageURL,
      status: 'success',
    };
  }
}
