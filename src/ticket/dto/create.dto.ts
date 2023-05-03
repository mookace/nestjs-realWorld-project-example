import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ticketCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  body: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  priority?: number;
}
