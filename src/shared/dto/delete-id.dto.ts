import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteIdDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;
}
