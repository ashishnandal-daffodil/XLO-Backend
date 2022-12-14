export class CreateProductDto {
  title: string;
  price: number;
  description: string;
  category: string;
  purchased_on: Date;
  owner: number;
  photos: object;
  thumbnail_url: string;
  thumbnail_uploaded: boolean;
  active: boolean;
  created_on: Date;
  updated_on: Date;
  expire_on: Date; //(30 days max after created)
  closed_on: Date;
}
