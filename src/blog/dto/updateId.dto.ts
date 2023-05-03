import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BlogUpdateIdDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false, nullable: true })
  body?: string;

  @ApiProperty({ required: false, nullable: true })
  image?: string;

  @ApiProperty({ required: false, nullable: true })
  status?: number;
}
