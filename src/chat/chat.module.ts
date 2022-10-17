import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './gateway/chat.gateway';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [UsersModule, RoomModule],
  providers: [ChatGateway]
})
export class ChatModule {}
=======
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatGateway],
})
export class ChatModule {}
>>>>>>> 05539d8dcecaefae52bea12cf88dd674f37c5adc
