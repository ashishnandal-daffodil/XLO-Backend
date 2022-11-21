import { Module } from "@nestjs/common";
import { SocketConnectionService } from "./socket-connection.service";
import { SocketConnectionController } from "./socket-connection.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { SocketConnection, SocketConnectionSchema } from "src/schemas/socketConnection.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: SocketConnection.name, schema: SocketConnectionSchema }])],
  controllers: [SocketConnectionController],
  providers: [SocketConnectionService],
  exports: [SocketConnectionService]
})
export class SocketConnectionModule {}
