import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  order_id: number;

  // 0=pending,1=sold,2=ongoing,3=delivered,4=completed,5=canceled
  @ApiProperty({ required: true })
  @IsNotEmpty()
  status: number;
}
