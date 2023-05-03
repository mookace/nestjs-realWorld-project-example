import { ApiProperty } from '@nestjs/swagger';

export class BannerDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  readonly image?: Express.Multer.File;

  @ApiProperty({ required: false })
  readonly is_main?: number;

  @ApiProperty({ required: false })
  readonly status?: number;
}
