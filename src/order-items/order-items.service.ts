import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { OrderEntity } from '../order/order.entity';
import { DateOrderItemDto } from './dto/date.dto';
import { OrderItemUpdateIdDto } from './dto/updateId.dto';
import { UserEntity } from '../user/user.entity';
import { slugify } from '../shared/other-helper';
import { OrderItemsEntity } from './order-items.entity';
import moment = require('moment');

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OrderItemsEntity)
    private readonly orderItemRepository: Repository<OrderItemsEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>
  ) {}

  async findAll(): Promise<OrderItemsEntity[]> {
    const data = await this.orderItemRepository.find({
      where: { is_deleted: false },
      order: { created_at: 'ASC' },
    });

    return data;
  }

  // Total Pending
  async Pending(vendor_id: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: vendor_id, is_deleted: false },
    });

    //admin
    if (user.roles == 1) {
      const [data, count] = await this.orderItemRepository.findAndCount({
        where: { is_deleted: false, status: 2 },
      });

      return count;
    }
    //vendor
    else if (user.roles == 2) {
      const [data, count] = await this.orderItemRepository.findAndCount({
        where: { is_deleted: false, status: 2, user_id: vendor_id },
      });

      return count;
    } else {
      throw new HttpException(
        {
          msg: 'unAuthorized',
          errors: { msg: `unAuthorized` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //Total Delivered for admin
  async Delivered(vendor_id: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: vendor_id, is_deleted: false },
    });

    //admin
    if (user.roles == 1) {
      const [data, count] = await this.orderItemRepository.findAndCount({
        where: { is_deleted: false, status: 4 },
      });

      return count;
    }
    //vendor
    else if (user.roles == 2) {
      const [data, count] = await this.orderItemRepository.findAndCount({
        where: { is_deleted: false, status: 4, user_id: vendor_id },
      });

      return count;
    } else {
      throw new HttpException(
        {
          msg: 'unAuthorized',
          errors: { msg: `unAuthorized` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async ProductByVendor(
    vendor_id: number,
    order_id: number
  ): Promise<{ allData; order }> {
    const allData = await this.orderItemRepository.find({
      relations: ['product_id'],
      where: {
        is_deleted: false,
        order_id: order_id,
        product_id: { user_id: vendor_id },
      },
      order: { created_at: 'ASC' },
    });

    const order = await this.orderRepository.findOne({
      where: { id: order_id },
    });

    return { allData, order };
  }

  //Total sales for admin
  async Sales(vendor_id: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: vendor_id, is_deleted: false },
    });

    if (user.roles == 1) {
      const [data, count] = await this.orderItemRepository.findAndCount({
        where: {
          is_deleted: false,
          sales: 1,
        },
      });

      return count;
    } else if (user.roles == 2) {
      const [data, count] = await this.orderItemRepository.findAndCount({
        relations: ['product_id'],
        where: {
          is_deleted: false,
          sales: 1,
          product_id: { user_id: vendor_id },
        },
      });

      return count;
    } else {
      throw new HttpException(
        {
          msg: 'unAuthorized',
          errors: { msg: `unAuthorized` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //Total order item for admin with date
  async Total(body: DateOrderItemDto, id: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: id, is_deleted: false },
    });

    if (user.roles == 1) {
      const start = new Date(body.start);
      const end = new Date(body.end);
      end.setDate(end.getDate() + 1);

      const [data, count] = await this.orderItemRepository.findAndCount({
        where: {
          is_deleted: false,
          created_at: Between(start, end),
        },
      });

      return count;
    } else if (user.roles == 2) {
      const start = new Date(body.start);
      const end = new Date(body.end);
      end.setDate(end.getDate() + 1);
      const [data, count] = await this.orderItemRepository.findAndCount({
        relations: ['product_id'],
        where: {
          is_deleted: false,
          product_id: { user_id: id },
          created_at: Between(start, end),
        },
      });

      return count;
    } else {
      throw new HttpException(
        {
          msg: 'unAuthorized',
          errors: { msg: `unAuthorized` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //Total sales for admin with date
  async TotalSales(body: DateOrderItemDto, id: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: id, is_deleted: false },
    });

    if (user.roles == 1) {
      const start = new Date(body.start);
      const end = new Date(body.end);
      end.setDate(end.getDate() + 1);
      const [data, count] = await this.orderItemRepository.findAndCount({
        where: {
          is_deleted: false,
          sales: 1,
          created_at: Between(start, end),
        },
      });

      return count;
    } else if (user.roles == 2) {
      const start = new Date(body.start);
      const end = new Date(body.end);
      end.setDate(end.getDate() + 1);
      const [data, count] = await this.orderItemRepository.findAndCount({
        relations: ['product_id'],
        where: {
          is_deleted: false,
          sales: 1,
          product_id: { user_id: id },
          created_at: Between(start, end),
        },
      });

      return count;
    } else {
      throw new HttpException(
        {
          msg: 'unAuthorized',
          errors: { msg: `unAuthorized` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //Total cancel for admin with date
  async TotalCancel(body: DateOrderItemDto, id: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: id, is_deleted: false },
    });

    if (user.roles == 1) {
      const start = new Date(body.start);
      const end = new Date(body.end);
      end.setDate(end.getDate() + 1);
      const [data, count] = await this.orderItemRepository.findAndCount({
        where: {
          is_deleted: false,
          cancel: 1,
          created_at: Between(start, end),
        },
      });

      return count;
    } else if (user.roles == 2) {
      const start = new Date(body.start);
      const end = new Date(body.end);
      end.setDate(end.getDate() + 1);
      const [data, count] = await this.orderItemRepository.findAndCount({
        relations: ['product_id'],

        where: {
          is_deleted: false,
          cancel: 1,
          product_id: { user_id: id },
          created_at: Between(start, end),
        },
      });

      return count;
    } else {
      throw new HttpException(
        {
          msg: 'unAuthorized',
          errors: { msg: `unAuthorized` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //Total Cancel for admin
  async Cancel(vendor_id: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: vendor_id, is_deleted: false },
    });

    if (user.roles == 1) {
      const [data, count] = await this.orderItemRepository.findAndCount({
        where: {
          is_deleted: false,
          cancel: 1,
        },
      });

      return count;
    } else if (user.roles == 2) {
      const [data, count] = await this.orderItemRepository.findAndCount({
        relations: ['product_id'],
        where: {
          is_deleted: false,
          cancel: 1,
          product_id: { user_id: vendor_id },
        },
      });

      return count;
    } else {
      throw new HttpException(
        {
          msg: 'unAuthorized',
          errors: { msg: `unAuthorized` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findByOrder(id: number): Promise<OrderItemsEntity[]> {
    const data = await this.orderItemRepository.find({
      where: {
        order_id: id,
        is_deleted: false,
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

  //cancel order
  async CancelOrder(id: number): Promise<OrderItemsEntity> {
    let toUpdate = await this.orderItemRepository.findOne({
      where: { id: id, is_deleted: false },
    });
    if (!toUpdate) {
      throw new HttpException(
        {
          msg: 'Data Not Found',
          errors: { msg: `Data Not Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    if (!toUpdate.slug) {
      toUpdate.slug = slugify('order_item');
    }

    toUpdate.updated_at = new Date();

    const saveData = Object.assign(toUpdate, { cancel: 1 });
    return await this.orderItemRepository.save(saveData);
  }

  async findMyOrder(user_id: number): Promise<OrderItemsEntity[]> {
    const data = await this.orderItemRepository.find({
      where: {
        user_id: user_id,
        is_deleted: false,
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

  //update with id
  async updateId(updateData: OrderItemUpdateIdDto): Promise<OrderItemsEntity> {
    let toUpdate = await this.orderItemRepository.findOne({
      where: { id: updateData.id, is_deleted: false },
    });
    if (!toUpdate) {
      throw new HttpException(
        {
          msg: 'Data Not Found',
          errors: { msg: `Data Not Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    toUpdate.updated_at = new Date();
    delete updateData.colour;

    const saveData = Object.assign(toUpdate, updateData);
    return await this.orderItemRepository.save(saveData);
  }

  //Delete section with id
  async deleteId(id: number): Promise<any> {
    let toDelete = await this.orderItemRepository.findOne({
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
    toDelete.deleted_at = new Date();
    toDelete.is_deleted = true;

    return await this.orderItemRepository.save(toDelete);
  }
}
