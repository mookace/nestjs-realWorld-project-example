import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class InsertImageDto {
  @ApiProperty()
  @IsNotEmpty()
  image_id?: number;
}
