import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { FavoriteDto } from './dto/favorite.dto';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(@Body() favoriteData: FavoriteDto) {
    return this.favoritesService.create(favoriteData);
  }

  @Get('usersFavorites')
  async findAll(@Query() { userId }) {
    return this.favoritesService.findAll(userId);
  }
}
