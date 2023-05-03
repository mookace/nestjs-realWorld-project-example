import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SubSectionUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  section_id: number;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty({ required: false })
  values?: string;

  @ApiProperty({ required: false })
  status?: number;
}
