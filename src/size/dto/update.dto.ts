import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SizeUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  regular_price: number;

  @ApiProperty({ required: false })
  discount_status?: number;

  @ApiProperty({ required: false })
  discount?: number;

  @ApiProperty({ required: false })
  discount_type?: number;

  @ApiProperty()
  @IsNotEmpty()
  size: string;

  @ApiProperty({ required: false })
  quantity?: number;

  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty()
  @IsNotEmpty()
  colour_id: number;

  @ApiProperty({ required: false })
  status?: number;
}
