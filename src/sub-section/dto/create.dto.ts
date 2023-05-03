import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SubSectionCreateDto {
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
