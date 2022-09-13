import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Favorite as Favorite_Def, FavoriteDocument } from "src/schemas/favorite.schema";

@Injectable()
export class FavoritesService {
  constructor(@InjectModel(Favorite_Def.name) private productModel: Model<FavoriteDocument>) {}

  async create(favoriteData) {
    return this.productModel.insertMany(favoriteData);
  }
}
