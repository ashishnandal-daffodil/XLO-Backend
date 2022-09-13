import { Controller, Post, Body } from "@nestjs/common";
import { FavoriteDto } from "./dto/favorite.dto";
import { FavoritesService } from "./favorites.service";

@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(@Body() favoriteData: FavoriteDto) {
    console.log("create");
    return this.favoritesService.create(favoriteData);
  }
}
