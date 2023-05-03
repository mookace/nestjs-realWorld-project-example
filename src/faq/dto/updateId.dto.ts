import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FaqUpdateIdDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  qsn: string;

  @ApiProperty({ required: false })
  qsn_id?: number;

  @ApiProperty({ required: false })
  ans?: string;

  @ApiProperty({ required: false })
  status?: number;
}
