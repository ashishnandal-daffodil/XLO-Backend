import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { Notification, NotificationSchema } from "../schemas/notifications.schema";
import { UsersModule } from "src/users/users.module";
import { ChatModule } from "src/chat/chat.module";
import { SocketConnectionModule } from "src/socket-connection/socketConnection.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]), UsersModule, forwardRef(() => ChatModule), SocketConnectionModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}
