import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BrandUpdateIdDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ type: 'string', required: false })
  image?: string;

  @ApiProperty({ required: false })
  status?: number;
}
