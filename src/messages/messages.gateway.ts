
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server,Socket} from 'socket.io';
import { RoomService } from 'src/room/room.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from "src/users/users.service";
import { Room } from "src/schemas/room.schema";
import mongoose from "mongoose";
import { ObjectID } from "typeorm";

@WebSocketGateway(8001,{
  cors:{
    origin:"*",
  },
})
export class MessagesGateway {

  @WebSocketServer()
  server:Server;
   
  constructor(private readonly messagesService: MessagesService,private roomService: RoomService,private usersService: UsersService) {}


    async handleConnection(socket: Socket) {
    try {
      const token = await socket.handshake.headers.authorization;
      // console.log("token --> ",token)
      const {user} = await this.usersService.getByToken(token);
      // console.log("user ---->",user);
      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        console.log("user  id ---->",socket.data.user._id);

        return this.onGetMyRooms(socket);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit("Error", new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage("createRoom")
  async onCreateRoom(socket: Socket, room: Room): Promise<Room> {
    return this.roomService.createRoom(room, socket.data.user);
  }


  @SubscribeMessage("getMyRooms")
  async onGetMyRooms(socket: Socket, userId?:string): Promise<any> {
    let userID  = userId ? new mongoose.Types.ObjectId(userId) : socket.data.user._id;
    const rooms = await this.roomService.getRoomsForUser(userID);
    console.log("🚀 ~ file: messages.gateway.ts ~ line 63 ~ MessagesGateway ~ onGetMyRooms ~ userId", rooms)
    // Only emit rooms to the specific connected client
    return this.server.to(socket.id).emit("rooms", rooms);
  }

  @SubscribeMessage("getChatForRoom")
  async onGetChatForRoom(socket: Socket, roomId: number): Promise<any> {
    const messages = await this.roomService.getChatForRoom(roomId, socket.data.user);
    return this.server.to(socket.id).emit("messages", messages);
  }

  @SubscribeMessage("sendMessage")
  async onSendMessage(socket, data): Promise<any> {
    let message = data.message;
    let roomId = data.roomId;
    await this.roomService.sendMessage(message, roomId, socket.data.user);
    const messages = await this.roomService.getChatForRoom(roomId, socket.data.user);
    await this.server.to(socket.id).emit("messages", messages);
    return this.onGetMyRooms(socket);
  }

  @SubscribeMessage('typing')
  async typing(@MessageBody('isTyping') isTyping: boolean,@ConnectedSocket() socket:Socket,){
      const userName= socket.data.user.name;
        socket.broadcast.emit('typing',{userName,isTyping}); 
      }

}



// @SubscribeMessage('createMessage')
// async create(@MessageBody() createMessageDto: CreateMessageDto,@ConnectedSocket() socket:Socket) {
//   console.log("body ",createMessageDto)
//   const message = await this.messagesService.create(createMessageDto,socket.id);
//   this.server.emit('message',message)
//   return message;
// }

// @SubscribeMessage('findAllMessages')
// findAll() {
//   return this.messagesService.findAll();
// }

// @SubscribeMessage('join')
// joinRoom(@MessageBody('name') name:string,@ConnectedSocket() socket: Socket){
//    console.log("name in backend",name);
//   return this.messagesService.identify(name,socket.id);
  
// }

// @SubscribeMessage('typing')
// async typing(@MessageBody('isTyping') isTyping: boolean,@ConnectedSocket() socket:Socket,){
//       const name = await this.messagesService.getClientName(socket.id);
//       socket.broadcast.emit('typing',{name,isTyping}); 
//     }


// @SubscribeMessage("getMyRooms")
// async onGetMyRooms(socket: Socket): Promise<any> {
//   const rooms = await this.roomService.getRoomsForUser(socket.data.user._id);
//   // Only emit rooms to the specific connected client
//   console.log("rooms --> ",rooms)
//   return this.server.to(socket.id).emit("rooms", rooms);
// }


// // @SubscribeMessage('findOneMessage')
// // findOne(@MessageBody() id: number) {
// //   return this.messagesService.findOne(id);
// // }

// // @SubscribeMessage('updateMessage')
// // update(@MessageBody() updateMessageDto: UpdateMessageDto) {
// //   return this.messagesService.update(updateMessageDto.id, updateMessageDto);
// // }

// // @SubscribeMessage('removeMessage')
// // remove(@MessageBody() id: number) {
// //   return this.messagesService.remove(id);
// // }

