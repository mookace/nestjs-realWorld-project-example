import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ required: false })
  billing?: JSON;

  @ApiProperty({ required: false })
  shipping?: JSON;

  @ApiProperty({ required: false })
  customer_info?: JSON;

  @ApiProperty({ type: 'simple-array' })
  products: any;

  @ApiProperty({ required: false, default: 0 })
  type?: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  total_price: number;

  // 0=pending,1=sold,2=ongoing,3=delivered,4=completed,5=canceled
  @ApiProperty({
    type: 'enum',
    enum: [0, 1, 2, 3, 4, 5],
    default: 0,
    required: false,
  })
  status?: number;
}
