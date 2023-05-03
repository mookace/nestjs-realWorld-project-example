import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategotyDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty({ required: false })
  short_description?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  is_popular?: number;

  @ApiProperty({ required: false })
  is_cat_display_hmpg?: number;

  @ApiProperty({ required: false })
  is_subcat_display_hmpg?: number;

  @ApiProperty({ required: false })
  status?: number;

  @ApiProperty({ required: false })
  parentId?: string;

  @ApiProperty({ required: false })
  childCategoryId?: string;
}
