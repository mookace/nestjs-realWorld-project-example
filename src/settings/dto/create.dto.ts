import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SettingCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  value: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  status?: number;
}
