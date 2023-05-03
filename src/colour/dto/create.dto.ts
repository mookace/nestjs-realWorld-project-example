import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ColorCreateIdDto {
  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty()
  @IsNotEmpty()
  colour: string;

  @ApiProperty({ required: false, nullable: true })
  quantity?: number;

  @ApiProperty({ required: false, nullable: true })
  price?: number;

  @ApiProperty()
  @IsNotEmpty()
  product_id: number;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty({ required: false, default: false })
  is_image_main?: boolean;

  @ApiProperty({ required: false })
  status?: number;
}
