import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProductUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty({ required: false })
  model_no?: string;

  @ApiProperty({ required: false })
  gaurantee?: string;

  @ApiProperty({ required: false })
  delivery_time?: string;

  @ApiProperty({ required: false })
  size_available?: string;

  @ApiProperty({ required: false })
  colour_available?: string;

  @ApiProperty({ required: false })
  min_order?: string;

  @ApiProperty({ required: false })
  sub_unit: string;

  @ApiProperty({ required: false })
  per_unit_qty: string;

  //Number of Product
  @ApiProperty({ required: false })
  quantity?: number;

  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty({ required: false })
  brand?: any;

  //where 0=single product,1=wholesale product
  @ApiProperty({ required: false })
  sale_type?: number;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  cat?: any;

  @ApiProperty({ required: false })
  sub_cat?: any;

  @ApiProperty({ required: false })
  sub_sub_cat?: any;

  @ApiProperty({ required: false })
  attributes?: JSON;

  @ApiProperty()
  @IsNotEmpty()
  features: JSON;

  @ApiProperty({ required: false })
  specification?: JSON;

  @ApiProperty({ required: false })
  min_price: string;

  @ApiProperty({ required: false })
  max_price: string;

  @ApiProperty({ required: false })
  wholesale_price_type: number;

  @ApiProperty({ required: false })
  production_capacity: string;

  @ApiProperty({ required: false })
  product_service_code: string;

  @ApiProperty({ required: false })
  wholesale_image?: JSON;
}
