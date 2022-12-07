import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProductsModule } from "./products/products.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { ChatModule } from "./chat/chat.module";
import { RoomModule } from "./room/room.module";
import { CategoryModule } from "./categories/categories.module";
import { SocketConnectionModule } from "./socket-connection/socketConnection.module";
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forRoot("mongodb://localhost/nest"),
    UsersModule,
    AuthModule,
    FavoritesModule,
    ChatModule,
    RoomModule,
    CategoryModule,
    SocketConnectionModule,
    NotificationsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
