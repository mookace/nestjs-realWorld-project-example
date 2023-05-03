import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FavCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  product: number;
}
