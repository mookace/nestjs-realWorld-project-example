import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DateOrderItemDto {
  @ApiProperty({ example: '2023-03-19' })
  @IsNotEmpty()
  start: string;

  @ApiProperty({ example: '2023-03-20' })
  @IsNotEmpty()
  end: string;
}
