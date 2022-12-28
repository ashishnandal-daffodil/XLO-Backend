import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
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
import { NotificationsModule } from "./notifications/notifications.module";
import { SearchModule } from "./search/search.module";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { TokenAuthorizationMiddleware } from "./middlewares/token-authorization.middleware";

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
    NotificationsModule,
    SearchModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number(),
        NODE_ENV: Joi.string().required(),
        ELASTICSEARCH_NODE: Joi.string().required(),
        ELASTICSEARCH_INDEX: Joi.string().required()
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenAuthorizationMiddleware).forRoutes("/");
  }
}
