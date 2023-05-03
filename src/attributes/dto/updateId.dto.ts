import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AttributeUpdateIdDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ required: false, nullable: true })
  att_id?: number;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false, nullable: true })
  status?: number;

  @ApiProperty({ required: false, nullable: true })
  attribute?: string;
}
