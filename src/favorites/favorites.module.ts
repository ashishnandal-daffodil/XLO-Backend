import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Favorite, FavoriteSchema } from "src/schemas/favorite.schema";
import { FavoritesController } from "./favorites.controller";
import { FavoritesService } from "./favorites.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Favorite.name, schema: FavoriteSchema }])],
  controllers: [FavoritesController],
  providers: [FavoritesService]
})
export class FavoritesModule {}
