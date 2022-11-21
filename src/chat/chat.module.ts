import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './gateway/chat.gateway';
import { RoomModule } from 'src/room/room.module';
import { SocketConnectionModule } from 'src/socket-connection/socketConnection.module';

@Module({
  imports: [UsersModule, RoomModule, SocketConnectionModule],
  providers: [ChatGateway]
})
export class ChatModule {}