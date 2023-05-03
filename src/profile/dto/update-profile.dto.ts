import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty({ required: false })
  date_of_birth?: string;

  @ApiProperty({ required: false })
  gender?: string;

  @ApiProperty({ required: false })
  company?: string;

  @ApiProperty({ required: false })
  country?: string;
}
