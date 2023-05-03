import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FaqAnsDto {
  @ApiProperty()
  @IsNotEmpty()
  qsn_id: number;

  @ApiProperty()
  @IsNotEmpty()
  ans: string;
}
