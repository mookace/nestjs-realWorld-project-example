import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FaqCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  qsn: string;
}
