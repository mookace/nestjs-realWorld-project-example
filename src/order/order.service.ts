import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { Between, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { slugify } from '../shared/other-helper';
import { UserEntity } from '../user/user.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { CreateStatusDto } from './dto/status.dto';
import { HistoryEntity } from '../history/history.entity';
import { HistoryService } from '../history/history.service';
import moment = require('moment');
import { DateOrderDto } from './dto/date.dto';
import { OrderItemsEntity } from '../order-items/order-items.entity';
import { SizeEntity } from '../size/size.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly notificationService: HistoryService,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OrderItemsEntity)
    private readonly orderItemRepository: Repository<OrderItemsEntity>,
    @InjectRepository(SizeEntity)
    private readonly sizeRepository: Repository<SizeEntity>,
    @InjectRepository(HistoryEntity)
    private readonly hostoryRepository: Repository<HistoryEntity>
  ) {}

  public sendNotification(user_id: number, msg: string) {
    this.notificationService.sendNotification(user_id, msg);
    return 'Notification sent';
  }

  //Create Order
  async create(
    orderData: CreateOrderDto,
    user_id: number
  ): Promise<OrderEntity> {
    const userData = await this.userRepository.findOne({
      where: { id: user_id },
    });

    //save order
    const order = new OrderEntity();
    order.slug = slugify('order');
    order.user_id = user_id;
    order.user_email = userData.email;
    order.status = orderData.status;
    order.billing = orderData.billing;
    order.shipping = orderData.shipping;
    order.customer_info = orderData.customer_info;
    order.type = orderData.type;
    order.total_price = orderData.total_price;
    let Data = await this.orderRepository.save(order);

    const saveData = await this.orderRepository.save(
      Object.assign(Data, {
        order_id_code: process.env.ORDER_CODE.concat(JSON.stringify(Data.id)),
      })
    );

    // save order history
    const history = new HistoryEntity();
    history.slug = slugify('history');
    history.user_id = user_id;
    history.order = saveData;
    history.message = 'Order added in history';
    history.notify = 1;
    const newHistory = await this.hostoryRepository.save(history);

    //send notification
    this.sendNotification(user_id, JSON.stringify(newHistory));

    // let dataDecoded = JSON.parse(JSON.stringify(orderData.products));

    let dataDecoded = JSON.parse(orderData.products);

    for (let i = 0; i < dataDecoded.length; i++) {
      //save order item
      const orderItem = new OrderItemsEntity();
      orderItem.slug = slugify('item');
      orderItem.user_id = user_id;
      orderItem.price = dataDecoded[i].price;
      orderItem.order_id = saveData.id;
      orderItem.product_id = dataDecoded[i].id;
      orderItem.quantity = parseInt(dataDecoded[i].quantity);
      orderItem.product = '';

      orderItem.size_var = dataDecoded[i].size_var;
      const saveOrder = await this.orderItemRepository.save(orderItem);

      //save order item history
      const itemHistory = new HistoryEntity();
      itemHistory.slug = slugify('history');
      itemHistory.user_id = saveOrder.user_id;
      itemHistory.user_id = user_id;
      itemHistory.order_item = saveOrder;
      itemHistory.message = 'order item added in history';
      await this.hostoryRepository.save(itemHistory);
    }

    return saveData;
  }

  async ChangeOrderStatus(statusData: CreateStatusDto): Promise<OrderEntity> {
    const orderData = await this.orderRepository.findOne({
      where: { id: statusData.order_id, is_deleted: false },
    });
    if (!orderData) {
      throw new HttpException(
        {
          msg: 'No Data Found',
          errors: { msg: 'No Data Found' },
          status: 'error',
        },
        HttpStatus.BAD_REQUEST
      );
    }
    if (!orderData.slug) {
      orderData.slug = slugify('order');
    }
    orderData.updated_at = new Date();
    delete statusData.order_id;

    let updated = Object.assign(orderData, statusData);

    if (statusData.status == 1) {
      const orderItem = await this.orderItemRepository.find({
        where: { order_id: updated.id, is_deleted: false },
      });

      const data = orderItem.map((item) => ({
        quantity: item.quantity,
        size: item.size_var['id'],
      }));

      for (let i = 0; i < data.length; i++) {
        const updateQuantity = await this.sizeRepository.findOne({
          where: { id: data[i].size },
        });
        if (!updateQuantity) {
          throw new HttpException(
            {
              msg: `Size Not Found`,
              errors: {
                msg: `Size Not Found`,
              },
              status: 'errors',
            },
            HttpStatus.BAD_REQUEST
          );
        }

        if (updateQuantity.quantity - data[i].quantity < 0) {
          throw new HttpException(
            {
              msg: `id=${data[i].size} Quantity is higher than stock`,
              errors: {
                msg: `id=${data[i].size} quantity is higher than stock`,
              },
              status: 'errors',
            },
            HttpStatus.BAD_REQUEST
          );
        }

        updateQuantity.quantity = updateQuantity.quantity - data[i].quantity;

        await this.sizeRepository.save(updateQuantity);
      }
    }

    if (statusData.status == 4) {
      updated.sales = 1;

      const orderItem = await this.orderItemRepository.find({
        where: { order_id: updated.id, is_deleted: false },
      });

      const itemIds = orderItem.map((item) => item.id);
      itemIds.forEach(async (item) => {
        const saveOrderItem = await this.orderItemRepository.findOne({
          where: { id: item },
        });
        const saveItem = Object.assign(saveOrderItem, { sales: 1 });
        await this.orderItemRepository.save(saveItem);
      });
    }

    if (statusData.status == 5) {
      updated.cancel = 1;

      const orderItem = await this.orderItemRepository.find({
        where: { order_id: updated.id, is_deleted: false },
      });

      const itemIds = orderItem.map((item) => item.id);
      itemIds.forEach(async (item) => {
        const saveOrderItem = await this.orderItemRepository.findOne({
          where: { id: item },
        });
        const saveItem = Object.assign(saveOrderItem, { cancel: 1 });
        await this.orderItemRepository.save(saveItem);
      });
    }
    const saveData = await this.orderRepository.save(updated);

    await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoinAndSelect('orderItem.order', 'order')
      .update(OrderItemsEntity)
      .set({ status: saveData.status, updated_at: new Date() })
      .where('order.id = :order_id', { order_id: saveData.id })
      .execute();

    return saveData;
  }

  //FInd All
  async findAll(): Promise<OrderEntity[]> {
    const data = await this.orderRepository.find({
      where: { is_deleted: false },
      order: { created_at: 'DESC' },
    });

    return data;
  }

  //Get order by vendor id
  async order(vendor_id: number): Promise<OrderEntity[]> {
    const user = await this.userRepository.findOne({
      where: { id: vendor_id, is_deleted: false },
    });

    //admin
    if (user.roles == 1) {
      const data = await this.orderRepository.find({
        where: { is_deleted: false },
        order: { created_at: 'ASC' },
      });

      return data;
    }
    //vendor
    else if (user.roles == 2) {
      const data = await this.orderItemRepository.find({
        relations: ['product_id'],
        where: { is_deleted: false, product_id: { user_id: vendor_id } },
        order: { created_at: 'ASC' },
      });

      const orderId = data.map((item) => item.order_id);
      let orders = [...new Set(orderId)];

      let allData = [];
      for (let i = 0; i < orders.length; i++) {
        const ordersData = await this.orderRepository.findOne({
          where: { id: orders[i], is_deleted: false },
        });

        allData.push(ordersData);
      }

      return allData;
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

  //Get Months Order
  async monthsOrder(): Promise<any> {
    // Get the current date
    const currentDate = new Date();

    //First date for search
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 3,
      0
    );

    //First Month
    const firstDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 2,
      1
    );

    // Second Month
    const secondDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );

    //Third Month
    const thirdDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    //Current Month
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );

    const data = await this.orderRepository.find({
      where: {
        is_deleted: false,
        created_at: Between(startDate, endDate),
      },
    });
    const firstMonth = firstDate.toISOString().slice(0, 7);
    const secondMonth = secondDate.toISOString().slice(0, 7);
    const thirdMonth = thirdDate.toISOString().slice(0, 7);
    const currentMonth = endDate.toISOString().slice(0, 7);

    let firstMonthData = 0;
    let secondMonthData = 0;
    let thirdMonthData = 0;
    let fourthMonthData = 0;

    data.forEach((item) => {
      let created_at = item.created_at.toString().slice(0, 7);
      if (created_at == firstMonth) {
        firstMonthData = firstMonthData + 1;
      }
      if (created_at == secondMonth) {
        secondMonthData = secondMonthData + 1;
      }
      if (created_at == thirdMonth) {
        thirdMonthData = thirdMonthData + 1;
      }
      if (created_at == currentMonth) {
        fourthMonthData = fourthMonthData + 1;
      }
    });
    let month = [
      moment(firstMonth).format('YYYY MMMM'),

      moment(secondMonth).format('YYYY MMMM'),

      moment(thirdMonth).format('YYYY MMMM'),

      moment(currentMonth).format('YYYY MMMM'),
    ];
    let total = [
      firstMonthData,

      secondMonthData,

      thirdMonthData,

      fourthMonthData,
    ];

    return { month, total };
  }

  // Total order according to date
  async dateOrder(body: DateOrderDto): Promise<number> {
    const start = new Date(body.start);

    const end = new Date(body.end);
    end.setDate(end.getDate() + 1);

    const [data, count] = await this.orderRepository.findAndCount({
      where: { created_at: Between(start, end) },
    });

    return count;
  }

  // Total order
  async totalOrders(): Promise<number> {
    const [data, count] = await this.orderRepository.findAndCount({
      where: { is_deleted: false },
      order: { created_at: 'DESC' },
    });

    return count;
  }

  //total sales with Date
  async totalSalesDate(body: DateOrderDto): Promise<number> {
    const start = new Date(body.start);

    const end = new Date(body.end);
    end.setDate(end.getDate() + 1);

    const [data, count] = await this.orderRepository.findAndCount({
      where: { is_deleted: false, sales: 1, created_at: Between(start, end) },
    });

    return count;
  }

  //total cancel with Date
  async totalCancelDate(body: DateOrderDto): Promise<number> {
    const start = new Date(body.start);

    const end = new Date(body.end);
    end.setDate(end.getDate() + 1);

    const [data, count] = await this.orderRepository.findAndCount({
      where: {
        is_deleted: false,
        cancel: 1,
        created_at: Between(start, end),
      },
    });

    return count;
  }

  //total sales
  async totalSales(): Promise<number> {
    const [data, count] = await this.orderRepository.findAndCount({
      where: { is_deleted: false, sales: 1 },
    });

    return count;
  }

  //total cancel
  async totalCancel(): Promise<number> {
    const [data, count] = await this.orderRepository.findAndCount({
      where: { is_deleted: false, cancel: 1 },
    });

    return count;
  }

  //Latest 5 order
  async latest(): Promise<OrderEntity[]> {
    const data = await this.orderRepository.find({
      where: { is_deleted: false },
      order: { created_at: 'DESC' },
      take: 5,
    });

    return data;
  }

  //FInd today order and count
  async todayOrder(): Promise<{ allData: OrderEntity[]; count: number }> {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayDate = new Date().toISOString().split('T')[0];

    const data = await this.orderRepository.find({
      where: { is_deleted: false, created_at: Between(yesterday, tomorrow) },
      order: { created_at: 'ASC' },
    });

    const allData = data.filter(
      (item) => item.created_at.toString() == todayDate
    );

    return { allData, count: allData.length };
  }

  //FInd Total today
  async TotaltodayOrder(): Promise<number> {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayDate = new Date().toISOString().split('T')[0];

    const data = await this.orderRepository.find({
      where: { is_deleted: false, created_at: Between(yesterday, tomorrow) },
      order: { created_at: 'ASC' },
    });

    const allData = data.filter(
      (item) => item.created_at.toString() == todayDate
    );

    return allData.length;
  }

  //Single Order
  async SingleOrder(id: number): Promise<OrderEntity> {
    const data = await this.orderRepository.findOne({
      where: { id: id, is_deleted: false },
    });
    if (!data) {
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

  //Find My Order for customer
  async findMyOrder(user_id: number): Promise<OrderEntity[]> {
    const data = await this.orderRepository.find({
      where: {
        user_id: user_id,
        is_deleted: false,
      },
      order: { created_at: 'ASC' },
    });

    if (data.length == 0) {
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

  //Delete with id
  async deleteId(id: number): Promise<any> {
    let toDelete = await this.orderRepository.findOne({
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

  public monthData = async (start, end) => {
    const [data, count] = await this.orderRepository.findAndCount({
      where: {
        is_deleted: false,
        created_at: Between(start, end),
      },
      loadEagerRelations: false,
      loadRelationIds: true,
    });
    return { data, count };
  };

  //status
  // public orderStatus() {
  //   return [
  //     { value: '0', label: 'Received', id: '' },
  //     { value: '1', label: 'Accepted', id: '' },
  //     { value: '2', label: 'InProgress', id: '' },
  //     { value: '3', label: 'ReadyToDelivery', id: '' },
  //     { value: '4', label: 'Completed', id: '' },
  //     { value: '5', label: 'Rejected', id: '' },
  //   ];
  // }
}
