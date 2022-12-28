import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import {
  UserConnection,
  UserConnectionSchema,
} from 'src/schemas/userConnection.schema';
import { MailService } from 'src/services/mail/mail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: UserConnection.name, schema: UserConnectionSchema },
    ]),
    ConfigModule
  ],
  providers: [UsersService, MailService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
