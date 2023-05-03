import { ApiProperty } from '@nestjs/swagger';

export class ImageDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: Express.Multer.File;
}
