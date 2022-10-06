import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';

export class FavoriteDto {
  user: User;
  product: Product;
  favorite: boolean;
}
