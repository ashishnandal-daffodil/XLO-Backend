import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './gateway/chat.gateway';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [UsersModule, RoomModule],
  providers: [ChatGateway]
})
export class ChatModule {}