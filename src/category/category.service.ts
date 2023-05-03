import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateCategotyDto } from './dto/create-category.dto';
import { slugify } from '../shared/other-helper';
import { CategotyUpdateIdDto } from './dto/updateId.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {}

  async findAllCategory(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      where: { is_deleted: false },
      order: { id: 'ASC' },
    });
  }

  //Find others Catgeory
  async OthersCategory(
    cat: number | null,
    sub: number | null
  ): Promise<CategoryEntity[]> {
    if (sub) {
      const data = await this.categoryRepository.find({
        where: { is_deleted: false, childCategoryId: sub, status: 2 },
        order: { id: 'ASC' },
      });
      return data;
    } else if (cat) {
      const all = await this.categoryRepository.find({
        where: { is_deleted: false, parentId: cat, status: 1 },
        order: { id: 'ASC' },
      });
      let data = [];
      for (let i = 0; i < all.length; i++) {
        const one = await this.categoryRepository.findOne({
          where: { is_deleted: false, childCategoryId: all[i].id, status: 2 },
        });

        if (one) {
          data.push({ ...all[i], subSububCatStatus: 1 });
        } else {
          data.push({ ...all[i], subSububCatStatus: 0 });
        }
      }
      return data;
    } else {
      const data = await this.categoryRepository.find({
        where: { is_deleted: false, status: 0 },
        order: { id: 'ASC' },
      });
      return data;
    }
  }

  //Get Popular Category
  async popularCategory(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      where: {
        is_deleted: false,
        is_popular: 1,
        status: 0,
      },
      order: { id: 'ASC' },
    });
  }

  //Create Popular Category
  async createPopularCategory(id: number): Promise<CategoryEntity> {
    const [data, count] = await this.categoryRepository.findAndCount({
      where: {
        is_deleted: false,
        is_popular: 1,
        status: 0,
      },
      order: { id: 'ASC' },
    });
    if (data && count > 3) {
      throw new HttpException(
        {
          msg: 'Popular Category Reach Max Limit',
          errors: { msg: `Popular Category Reach Max Limit` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }
    const toUpdate = await this.categoryRepository.findOne({
      where: { id: id, is_deleted: false },
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
    } else if (toUpdate.is_popular == 1) {
      throw new HttpException(
        {
          msg: 'Already Popular Category',
          errors: { msg: `Already Popular Category` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    } else {
      toUpdate.is_popular = 1;
      return await this.categoryRepository.save(toUpdate);
    }
  }

  async findEightData(): Promise<CategoryEntity[]> {
    const data = await this.categoryRepository.find({
      where: { is_cat_display_hmpg: 1, is_deleted: false },
    });

    let eightDataArray = [];
    let eightData;
    for (let single of data) {
      eightData = await this.categoryRepository.find({
        where: { parentId: single.id, is_deleted: false },
        order: { id: 'ASC' },
        take: 8,
      });

      let sample = {
        cat: single,
        subcats: eightData,
      };
      eightDataArray.push(sample);
    }
    return eightDataArray;
  }

  async findFIveData(): Promise<CategoryEntity[]> {
    const data = await this.categoryRepository.find({
      where: {
        is_subcat_display_hmpg: 1,
        parentId: Not(IsNull()),
        childCategoryId: null,
        is_deleted: false,
      },
      order: { id: 'ASC' },
      take: 5,
    });
    return data;
  }

  async UserCategory(id: number): Promise<CategoryEntity[]> {
    console.log('id', id);
    return await this.categoryRepository.find({
      where: { user_id: id, is_deleted: false },
      order: { id: 'ASC' },
    });
  }

  async findCategoryByParendId(parentId: number): Promise<CategoryEntity[]> {
    const data = await this.categoryRepository.find({
      where: {
        parentId: parentId,
        is_deleted: false,
      },
      order: { id: 'ASC' },
    });
    return data;
  }

  async findCategoryOnly(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      where: {
        parentId: null,
        childCategoryId: null,
        is_deleted: false,
        status: 0,
      },
      order: { id: 'ASC' },
    });
  }

  async findSubCategoryOnly(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      where: {
        parentId: Not(IsNull()),
        childCategoryId: null,
        is_deleted: false,
        status: 1,
      },
      order: { id: 'ASC' },
    });
  }

  async findSubsubCategoryOnly(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      where: {
        parentId: Not(IsNull()),
        childCategoryId: Not(IsNull()),
        is_deleted: false,
        status: 2,
      },
      order: { id: 'ASC' },
    });
  }

  // Find Cat by Id
  async findCategoryById(id: number): Promise<CategoryEntity> {
    const data = await this.categoryRepository.findOne({
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

  async addCategory(
    categoryData: CreateCategotyDto,
    user_id: number
  ): Promise<CategoryEntity> {
    const category = new CategoryEntity();
    category.name = categoryData.name;
    category.user_id = user_id;
    category.slug = slugify(categoryData.name);
    category.image = categoryData.image;
    category.description = categoryData.description;
    category.short_description = categoryData.short_description;
    category.is_cat_display_hmpg = categoryData.is_cat_display_hmpg;
    category.is_subcat_display_hmpg = categoryData.is_subcat_display_hmpg;
    category.product = [];
    category.sub_product = [];
    category.sub_sub_product = [];

    if (categoryData.parentId) {
      category.parentId = parseInt(categoryData.parentId);
      category.status = 1;
    }
    if (categoryData.childCategoryId) {
      category.childCategoryId = parseInt(categoryData.childCategoryId);
      category.status = 2;
    }

    const saveCategory = await this.categoryRepository.save(category);

    return saveCategory;
  }

  // Update cat id
  async updateCategoryId(dto: CategotyUpdateIdDto): Promise<CategoryEntity> {
    let toUpdate = await this.categoryRepository.findOne({
      where: { id: dto.id, is_deleted: false },
    });

    if (!toUpdate) {
      throw new HttpException(
        {
          msg: 'No Category Found',
          errors: { msg: `No Category Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    if (!toUpdate.slug) {
      toUpdate.slug = slugify(toUpdate.name);
    }

    toUpdate.updated_at = new Date();

    if (dto.parentId) {
      toUpdate.parentId = parseInt(dto.parentId);
      toUpdate.status = 1;
      delete dto.parentId;
    }
    if (dto.childCategoryId) {
      toUpdate.childCategoryId = parseInt(dto.childCategoryId);
      toUpdate.status = 2;
      delete dto.childCategoryId;
    }

    let updated = Object.assign(toUpdate, dto);
    return await this.categoryRepository.save(updated);
  }

  //delete cat id
  async deleteCategoryId(id: number): Promise<any> {
    let toDelete = await this.categoryRepository.findOne({
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
    return await this.categoryRepository.save(deleted);
  }
}
