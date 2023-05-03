import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetMessageDto {
  @ApiProperty()
  // @IsNotEmpty()
  user_id: number;

  @ApiProperty()
  // @IsNotEmpty()
  vendor_id: number;
}
