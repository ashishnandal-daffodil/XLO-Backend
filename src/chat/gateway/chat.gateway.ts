import { UnauthorizedException } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import mongoose from "mongoose";
import { Socket } from "socket.io";
import { RoomService } from "src/room/room.service";
import { Room } from "src/schemas/room.schema";
import { SocketConnectionService } from "src/socket-connection/socket-connection.service";
import { UsersService } from "src/users/users.service";

@WebSocketGateway({ cors: { origin: ["https://hoppscotch.io", "http://localhost:3000", "http://localhost:4200"] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private usersService: UsersService,
    private roomService: RoomService,
    private socketConnectionService: SocketConnectionService
  ) {}

  @WebSocketServer() server;

  async handleConnection(socket: Socket) {
    try {
      const token = socket.handshake.headers.authorization;
      const user = await this.usersService.getByToken(token);
      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        //Insert the connected socketId and corresponding userId
        await this.socketConnectionService.addConnectedUser({ user_id: user._id, socket_id: socket.id });
        //Get the user rooms by socket
        return this.onGetMyRooms(socket);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    //remove connection from socketConnection
    await this.socketConnectionService.removeConnectedUser(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit("Error", new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage("createRoom")
  async onCreateRoom(socket: Socket, room: Room): Promise<Room> {
    return this.roomService.createRoom(room);
    //Also send a notification to the seller that the buyer tried to communicate with you regarding a particular product
  }

  @SubscribeMessage("getMyRoomsAsBuyer")
  async onGetMyRoomsAsBuyer(socket: Socket, userId?): Promise<any> {
    let userID = userId ? new mongoose.Types.ObjectId(userId) : socket.data.user._id;
    const rooms = await this.roomService.getRoomsForUserAsBuyer(userID);
    // Only emit rooms to the specific connected client
    return this.server.to(socket.id).emit("roomsAsBuyer", rooms);
  }

  @SubscribeMessage("getMyRoomsAsSeller")
  async onGetMyRooms(socket: Socket, userId?): Promise<any> {
    let userID = userId ? new mongoose.Types.ObjectId(userId) : socket.data.user._id;
    const rooms = await this.roomService.getRoomsForUserAsSeller(userID);
    // Only emit rooms to the specific connected client
    return this.server.to(socket.id).emit("roomsAsSeller", rooms);
  }

  @SubscribeMessage("getChatForRoom")
  async onGetChatForRoom(socket: Socket, roomId: number): Promise<any> {
    const messages = await this.roomService.getChatForRoom(roomId, socket.data.user);
    return this.server.to(socket.id).emit("messages", messages);
  }

  @SubscribeMessage("sendMessage")
  async onSendMessage(socket, data): Promise<any> {
    let { message, roomId } = data;
    let { buyer_id, seller_id } = await this.roomService.sendMessage(message, roomId, socket.data.user);

    //Get latest_message object from room
    let { latest_message } = await this.roomService.getLatestMessage(roomId);

    //Find socket Id of connected users
    let buyerConnection = await this.socketConnectionService.findConnectedUser(buyer_id);
    let sellerConnection = await this.socketConnectionService.findConnectedUser(seller_id);
    let buyerSocketId = buyerConnection.length && buyerConnection[0].socket_id;
    let sellerSocketId = sellerConnection.length && sellerConnection[0].socket_id;

    if (buyerSocketId) {
      await this.server.to(buyerSocketId).emit("message", latest_message);
    }
    if (sellerSocketId) {
      await this.server.to(sellerSocketId).emit("message", latest_message);
    }
    return;
  }
}
