import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { Get, Post, Body, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateStatusDto } from './dto/status.dto';
import { AbilitiesGuard } from '../ability/ability.factory/abilities.guard';
import { CheckAbilities } from '../ability/ability.factory/abilities.decorator';
import { Action } from '../ability/ability.factory/ability.factory';
import { OrderEntity } from './order.entity';
import { DateOrderDto } from './dto/date.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { User } from '../shared/user.decorator';

@ApiBearerAuth()
@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Get All
  @Get('all')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderEntity })
  async findAll(): Promise<{ msg; data; status }> {
    const data = await this.orderService.findAll();
    return { msg: 'Get Order Successfully', data, status: 'success' };
  }

  //Total Order with date
  @Post('total-orders-date')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderEntity })
  async dateOrder(@Body() body: DateOrderDto): Promise<{ msg; data; status }> {
    console.log('total orders date');
    const data = await this.orderService.dateOrder(body);
    return { msg: 'Get Total Order Successfully', data, status: 'success' };
  }

  //Total sales with date
  @Post('total-sales-date')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderEntity })
  async totalSalesDate(
    @Body() body: DateOrderDto
  ): Promise<{ msg; data; status }> {
    const data = await this.orderService.totalSalesDate(body);
    return { msg: 'Get Total sales Successfully', data, status: 'success' };
  }

  //Total Cancel with date
  @Post('total-cancel-date')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderEntity })
  async totalCancelDate(
    @Body() body: DateOrderDto
  ): Promise<{ msg; data; status }> {
    const data = await this.orderService.totalCancelDate(body);
    return { msg: 'Get Total Cancel Successfully', data, status: 'success' };
  }

  //Total Order for admin without Date
  @Get('total-orders')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderEntity })
  async totalOrders(): Promise<{ msg; data; status }> {
    const data = await this.orderService.totalOrders();
    return { msg: 'Get Total Order Successfully', data, status: 'success' };
  }

  //Total sales for admin without Date
  @Get('total-sales')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderEntity })
  async totalSales(): Promise<{ msg; data; status }> {
    const data = await this.orderService.totalSales();
    return { msg: 'Get Total sales Successfully', data, status: 'success' };
  }

  //Total Cancel for admin without Date
  @Get('total-cancel')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderEntity })
  async totalCancel(): Promise<{ msg; data; status }> {
    const data = await this.orderService.totalCancel();
    return { msg: 'Get Total Cancel Successfully', data, status: 'success' };
  }

  //Get order according to vendor id
  @Get('all-order')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderEntity })
  async order(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.orderService.order(id);
    return { msg: 'Get Order Successfully', data, status: 'success' };
  }

  //Get latest four month order
  @Get('four-months')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderEntity })
  async monthsData(): Promise<{ msg; data; status }> {
    const data = await this.orderService.monthsOrder();
    return { msg: 'Get Order Successfully', data, status: 'success' };
  }

  //Latest Five order
  @Get('latest')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderEntity })
  async latest(): Promise<{ msg; data; status }> {
    const data = await this.orderService.latest();
    return { msg: 'Get 5 Order Successfully', data, status: 'success' };
  }

  // Get My Order for customer
  @Get('my-order')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderEntity })
  async myOrder(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.orderService.findMyOrder(id);
    return { msg: 'Get Order Successfully', data, status: 'success' };
  }

  //Today order
  @Get('today')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderEntity })
  async todayOrder(): Promise<{ msg; data; status }> {
    const data = await this.orderService.todayOrder();
    return { msg: 'Get Today Order Successfully', data, status: 'success' };
  }

  // Total Today order
  @Get('total-today')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderEntity })
  async TotaltodayOrder(): Promise<{ msg; data; status }> {
    const data = await this.orderService.TotaltodayOrder();
    return { msg: 'Get Today Order Successfully', data, status: 'success' };
  }

  //Get one order
  @Get('single/:id')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderEntity })
  async singleOrder(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.orderService.SingleOrder(id);
    return { msg: 'Get Single Order Successfully', data, status: 'success' };
  }

  // All Create
  @UsePipes(new ValidationPipe())
  @Post('create')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Create, subject: OrderEntity })
  async create(
    @User('id') id: number,
    @Body() orderData: CreateOrderDto
  ): Promise<{ msg; data; status }> {
    const data = await this.orderService.create(orderData, id);

    return { msg: 'Order Created Successfully', data: data, status: 'success' };
  }

  //Change status and update quantity
  @UsePipes(new ValidationPipe())
  @Post('change-status')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Update, subject: OrderEntity })
  async ChangeOrderStatus(
    @Body() statusData: CreateStatusDto
  ): Promise<{ msg; data; status }> {
    const data = await this.orderService.ChangeOrderStatus(statusData);
    return {
      msg: 'Order Status Changed Successfully',
      data,
      status: 'success',
    };
  }

  //Delete order
  // @Delete('delete/:slug')
  // @UseGuards(AbilitiesGuard)
  // @CheckAbilities({ action: Action.Delete, subject: OrderEntity })
  // async delete(@Body('slug') slug: string): Promise<{ msg; data; status }> {
  //   const data = await this.orderService.delete(slug);
  //   return { msg: 'Order Deleted Successfully', data, status: 'success' };
  // }

  //Delete order
  @Delete('delete')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Delete, subject: OrderEntity })
  async deleteId(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.orderService.deleteId(id);
    return { msg: 'Order Deleted Successfully', data, status: 'success' };
  }
}
