import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BannerUpdateIdDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ required: false })
  is_main?: number;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  status?: number;
}
