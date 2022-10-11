import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { RoomModule } from 'src/room/room.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, RoomModule],
  providers: [MessagesGateway, MessagesService]
})
export class MessagesModule {}
