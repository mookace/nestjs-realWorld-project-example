import { Controller } from '@nestjs/common';
import { Get, Post, Body, Param, UsePipes, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from '../ability/ability.factory/abilities.guard';
import { CheckAbilities } from '../ability/ability.factory/abilities.decorator';
import { Action } from '../ability/ability.factory/ability.factory';
import { DateOrderItemDto } from './dto/date.dto';
import { OrderItemUpdateIdDto } from './dto/updateId.dto';
import { ValidationPipe } from '../shared/pipes/validation.pipe';
import { OrderItemsService } from './order-items.service';
import { OrderItemsEntity } from './order-items.entity';
import { User } from '../shared/user.decorator';

@ApiBearerAuth()
@ApiTags('order-item')
@Controller('order-item')
export class OrderItemsController {
  constructor(private readonly orderItemService: OrderItemsService) {}

  //   Get All
  @Get('all')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderItemsEntity })
  async findAll(): Promise<{ msg; data; status }> {
    const data = await this.orderItemService.findAll();
    return { msg: 'Get Order Item Successfully', data, status: 'success' };
  }

  //Total pending order-item
  @Get('pending')
  async Pending(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.orderItemService.Pending(id);
    return { msg: 'Get Pending Item Successfully', data, status: 'success' };
  }

  //Total delivered order-Item
  @Get('delivered')
  async delivered(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.orderItemService.Delivered(id);
    return { msg: 'Get delivered Item Successfully', data, status: 'success' };
  }

  //Total order item with Date
  @Post('total')
  async Total(
    @Body() body: DateOrderItemDto,
    @User('id') id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.orderItemService.Total(body, id);
    return {
      msg: 'Get Total Order Item Successfully',
      data,
      status: 'success',
    };
  }

  //Total sales with Date
  @Post('total-sales')
  async TotalSales(
    @Body() body: DateOrderItemDto,
    @User('id') id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.orderItemService.TotalSales(body, id);
    return { msg: 'Get Total Sales Successfully', data, status: 'success' };
  }

  //Total cancel  with Date
  @Post('total-cancel')
  async TotalCancel(
    @Body() body: DateOrderItemDto,
    @User('id') id: number
  ): Promise<{ msg; data; status }> {
    const data = await this.orderItemService.TotalCancel(body, id);
    return { msg: 'Get Total Cancel Successfully', data, status: 'success' };
  }

  //Total sale
  @Get('sales')
  async Sales(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.orderItemService.Sales(id);
    return { msg: 'Get Total Sales Successfully', data, status: 'success' };
  }

  //Total cancel
  @Get('cancel')
  async Cancel(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.orderItemService.Cancel(id);
    return { msg: 'Get Total Cancel Successfully', data, status: 'success' };
  }

  //get all order-item product by vendor id
  @Get('vendor/:order')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderItemsEntity })
  async vendorProduct(
    @User('id') id: number,
    @Param('order') order: number
  ): Promise<{ msg; data; status }> {
    const data = await this.orderItemService.ProductByVendor(id, order);
    return { msg: 'Get Order Item Successfully', data, status: 'success' };
  }

  //cancel order item
  @Post('cancel-order/:id')
  async CancelOrder(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.orderItemService.CancelOrder(id);
    return { msg: 'Order Cancel Successfully', data, status: 'success' };
  }

  //find my-order
  @Get('my-order')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderItemsEntity })
  async MyOrder(@User('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.orderItemService.findMyOrder(id);
    return { msg: 'Get Order Item Successfully', data, status: 'success' };
  }

  //find by order id
  @Get('order/:id')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: OrderItemsEntity })
  async findByOrder(@Param('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.orderItemService.findByOrder(id);
    return { msg: 'Get Order Item Successfully', data, status: 'success' };
  }

  // Update Section with Id
  @UsePipes(new ValidationPipe())
  @Post('update')
  async updateId(
    @Body() updateData: OrderItemUpdateIdDto
  ): Promise<{ msg; data; status }> {
    const data = await this.orderItemService.updateId(updateData);
    return { msg: 'Order Item Updated Successfully', data, status: 'success' };
  }

  //Delete oreder_item with Id
  @UsePipes(new ValidationPipe())
  @Post('delete')
  async deleteId(@Body('id') id: number): Promise<{ msg; data; status }> {
    const data = await this.orderItemService.deleteId(id);
    return { msg: 'Order Item Deleted Successfully', data, status: 'success' };
  }
}
