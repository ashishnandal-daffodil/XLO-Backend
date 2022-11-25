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

@WebSocketGateway({
  cors: {
    origin: ["https://hoppscotch.io", "http://localhost:3000", "http://localhost:4200", "http://192.168.3.240:4200"]
  }
})
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
      if (!Object.keys(user).length) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        //Insert the connected socketId and corresponding userId
        await this.socketConnectionService.addConnectedUser({
          user_id: user._id,
          socket_id: socket.id
        });
        // await this.getConnectedSocketIdsOfUserRooms(user._id);
        let allConnectedUsers = await this.socketConnectionService.getAllConnectedUsers();
        //emit all online users to everyone
        this.server.emit("isOnline", allConnectedUsers);
        return this.onGetMyRooms(socket);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  // async getConnectedSocketIdsOfUserRooms(userId) {
  //   let myAllRooms = await this.roomService.getAllMyRooms(userId);
  //   let connectedUserIds = await myAllRooms.map(room => {
  //     if (room.buyer_id == userId) {
  //       return room.seller_id;
  //     }
  //     if (room.seller_id == userId) {
  //       return room.buyer_id;
  //     }
  //   });
  //   let connectedSocketIds = connectedUserIds.map(async userId => {
  //     let socketConnection = await this.socketConnectionService.findConnectedUser(userId);
  //     console.log(
  //       "🚀 ~ file: chat.gateway.ts ~ line 66 ~ ChatGateway ~ connectedSocketIds ~ socketConnection",
  //       socketConnection
  //     );
  //     // return socketConnection.socket_id;
  //   });
  //   console.log(
  //     "🚀 ~ file: chat.gateway.ts ~ line 80 ~ ChatGateway ~ getConnectedSocketIdsOfUserRooms ~ connectedSocketIds",
  //     connectedSocketIds
  //   );
  //   return connectedSocketIds;
  // }

  async handleDisconnect(socket: Socket) {
    //remove connection from socketConnection
    await this.socketConnectionService.removeConnectedUser(socket.id);
    //emit isOffline event to all users
    this.server.emit("isOffline", socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit("Error", new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage("login")
  async login(socket: Socket) {
    this.handleConnection(socket);
  }

  @SubscribeMessage("logout")
  async logout(socket: Socket) {
    this.handleDisconnect(socket);
  }

  @SubscribeMessage("getOnlineUsers")
  async getOnlineUsers(socket: Socket) {
    let allConnectedUsers = await this.socketConnectionService.getAllConnectedUsers();
    this.server.to(socket).emit("allConnectedUsers", allConnectedUsers);
  }

  @SubscribeMessage("createRoom")
  async onCreateRoom(socket: Socket, room: Room): Promise<Room> {
    let newRoom = await this.roomService.createRoom(room);
    let sellerSocketConnection = await this.socketConnectionService.findConnectedUser(room.seller_id);
    let buyerSocketConnection = await this.socketConnectionService.findConnectedUser(room.buyer_id);
    let sellerSocketId = sellerSocketConnection.length ? sellerSocketConnection[0].socket_id : null;
    let buyerSocketId = buyerSocketConnection.length ? buyerSocketConnection[0].socket_id : null;
    if (sellerSocketId) {
      await this.server.to(sellerSocketId).emit("newRoomCreated", newRoom);
    }
    if (buyerSocketId) {
      await this.server.to(buyerSocketId).emit("newRoomCreated", newRoom);
    }
    return;
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
    let { latest_message } = await this.roomService.getRoomInfo(roomId);

    //Find socket Id of connected users
    let buyerConnection = await this.socketConnectionService.findConnectedUser(buyer_id);
    let sellerConnection = await this.socketConnectionService.findConnectedUser(seller_id);
    let buyerSocketId = buyerConnection.length && buyerConnection[0].socket_id;
    let sellerSocketId = sellerConnection.length && sellerConnection[0].socket_id;

    if (buyerSocketId) {
      await this.server.to(buyerSocketId).emit("message", { latest_message: latest_message, roomId: roomId });
    }
    if (sellerSocketId) {
      await this.server.to(sellerSocketId).emit("message", { latest_message: latest_message, roomId: roomId });
    }
    return;
  }

  @SubscribeMessage("isTyping")
  async onIsTyping(socket, data): Promise<any> {
    let { userId, roomId } = data;
    let { buyer_id, seller_id } = await this.roomService.getRoomInfo(roomId);
    let connectedUser;
    if (buyer_id === userId) {
      connectedUser = await this.socketConnectionService.findConnectedUser(seller_id);
    } else {
      connectedUser = await this.socketConnectionService.findConnectedUser(buyer_id);
    }
    if (connectedUser.length) {
      return this.server.to(connectedUser[0].socket_id).emit("isTyping", { roomId: roomId });
    } else {
      return;
    }
  }
}
