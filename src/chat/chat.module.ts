import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { ChatGateway } from "./gateway/chat.gateway";
import { RoomModule } from "src/room/room.module";
import { SocketConnectionModule } from "src/socket-connection/socketConnection.module";
import { NotificationsModule } from "src/notifications/notifications.module";
import { NotificationsService } from "src/notifications/notifications.service";

@Module({
  imports: [UsersModule, RoomModule, SocketConnectionModule, NotificationsModule],
  providers: [ChatGateway]
})
export class ChatModule {}
