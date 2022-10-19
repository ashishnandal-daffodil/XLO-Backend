export class CreateProductDto {
  id:number;
  title: string ;
  price: number;
  description: string;
  category: string;
  subcategory: string;
  purchased_on: Date;
  owner: number;
  photos: string[];
  thumbnail_url: string;
  location:string;
  thumbnail_uploaded: boolean;
  active: boolean;
  seller:object;
  created_on: Date;
  updated_on: Date;
  expire_on: Date; //(30 days max after created)
  closed_on: Date;
}
