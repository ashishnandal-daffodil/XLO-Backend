import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Favorite as Favorite_Def,
  FavoriteDocument,
} from 'src/schemas/favorite.schema';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite_Def.name)
    private favoriteModel: Model<FavoriteDocument>,
  ) {}

  async create(favoriteData) {
    let { user, product } = favoriteData || {};

    let isFavorite = await this.favoriteModel.findOne({
      user: user,
      product: product,
    });

    if (!isFavorite) {
      return this.favoriteModel.insertMany(favoriteData);
    } else {
      return this.favoriteModel.updateOne(
        { _id: isFavorite._id },
        favoriteData,
      );
    }
  }

  async findAll(userId) {
    const query = this.favoriteModel.find({ user: userId }).sort({ id: 1 });
    return query;
  }
}
