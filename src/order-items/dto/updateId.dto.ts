import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OrderItemUpdateIdDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  order_id: number;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  colour: number;

  @ApiProperty()
  @IsNotEmpty()
  size: number;

  //where 0=single product,1=wholesale product
  @ApiProperty({ default: 0 })
  sale_type?: number;
}
