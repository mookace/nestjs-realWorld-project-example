import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CompanyUpdateDto {
  @ApiProperty()
  // @IsNotEmpty()
  id: number;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false, nullable: true })
  logo?: string;

  @ApiProperty({ required: false, nullable: true })
  year?: string;

  @ApiProperty({ required: false, nullable: true })
  legal_status?: string;

  @ApiProperty({ required: false, nullable: true })
  nature?: string;

  @ApiProperty({ required: false, nullable: true })
  employee?: string;

  @ApiProperty({ required: false, nullable: true })
  annual_turnover?: string;

  @ApiProperty({ required: false, nullable: true })
  member_since?: string;

  @ApiProperty({ required: false, nullable: true })
  IEC_code?: string;

  @ApiProperty({ required: false, nullable: true })
  exports_to?: string;

  @ApiProperty({ required: false, nullable: true })
  phone?: string;

  @ApiProperty({ required: false, nullable: true })
  fb_url?: string;

  @ApiProperty({ required: false, nullable: true })
  gmail_url?: string;

  @ApiProperty({ required: false, nullable: true })
  insta_url?: string;

  @ApiProperty({ required: false, nullable: true })
  location?: string;

  @ApiProperty({ required: false, nullable: true })
  country?: string;

  @ApiProperty({ required: false, nullable: true })
  address?: string;

  @ApiProperty({ required: false, nullable: true })
  status?: number;
}
