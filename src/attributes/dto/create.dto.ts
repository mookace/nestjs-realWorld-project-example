import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AttributeCreateDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  att_id?: number;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  status?: number;

  @ApiProperty({ required: false })
  attribute?: string;
}
