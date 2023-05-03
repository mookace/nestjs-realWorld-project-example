import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ticketUpdateIdDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  body: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  priority?: number;
}
