import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EnquiryDto {
  @ApiProperty({ required: false, nullable: true })
  email: string;

  @ApiProperty({ required: false, nullable: true })
  parent_id?: number;

  @ApiProperty({ required: false, nullable: true })
  description?: string;

  @ApiProperty({ required: false, nullable: true })
  phone?: string;

  @ApiProperty()
  @IsNotEmpty()
  vendor?: number;

  @ApiProperty({ required: false, nullable: true })
  product_id?: number;

  @ApiProperty({ required: false, nullable: true })
  qty?: number;

  @ApiProperty({ required: false, nullable: true })
  receiver_status?: number;

  @ApiProperty({ required: false, nullable: true })
  send_reply_status?: number;
}
