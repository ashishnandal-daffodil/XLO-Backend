import { UnauthorizedException } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { RoomService } from "src/room/room.service";
import { Room } from "src/schemas/room.schema";
import { UsersService } from "src/users/users.service";

@WebSocketGateway({ 
  cors:{
    origin:"*",
  },
  
  // cors: { origin: ["https://hoppscotch.io", "http://localhost:3000", "http://localhost:4200"] }
 })
 export class ChatGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('message')
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   constructor(private usersService: UsersService, private roomService: RoomService) {}

//   @WebSocketServer() server;

  // async handleConnection(socket: Socket) {
  //   try {
  //     const token = socket.handshake.headers.authorization;
  //     const user = await this.usersService.getByToken(token);
  //     if (!user) {
  //       return this.disconnect(socket);
  //     } else {
  //       socket.data.user = user;
  //       return this.onGetMyRooms(socket);
  //     }
  //   } catch {
  //     return this.disconnect(socket);
  //   }
  // }

  // handleDisconnect(socket: Socket) {
  //   socket.disconnect();
  // }

  // private disconnect(socket: Socket) {
  //   socket.emit("Error", new UnauthorizedException());
  //   socket.disconnect();
  // }

  // @SubscribeMessage("createRoom")
  // async onCreateRoom(socket: Socket, room: Room): Promise<Room> {
  //   return this.roomService.createRoom(room, socket.data.user);
  // }

  // @SubscribeMessage("getMyRooms")
  // async onGetMyRooms(socket: Socket): Promise<any> {
  //   const rooms = await this.roomService.getRoomsForUser(socket.data.user._id);
  //   // Only emit rooms to the specific connected client
  //   return this.server.to(socket.id).emit("rooms", rooms);
  // }

  // @SubscribeMessage("getChatForRoom")
  // async onGetChatForRoom(socket: Socket, roomId: number): Promise<any> {
  //   const messages = await this.roomService.getChatForRoom(roomId, socket.data.user);
  //   return this.server.to(socket.id).emit("messages", messages);
  // }

  // @SubscribeMessage("sendMessage")
  // async onSendMessage(socket, data): Promise<any> {
  //   let message = data.message;
  //   let roomId = data.roomId;
  //   await this.roomService.sendMessage(message, roomId, socket.data.user);
  //   const messages = await this.roomService.getChatForRoom(roomId, socket.data.user);
  //   await this.server.to(socket.id).emit("messages", messages);
  //   return this.onGetMyRooms(socket);
  // }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('message', message);
  }
}
