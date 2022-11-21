import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  SocketConnection,
  SocketConnection as SocketConnection_Def,
  SocketConnectionDocument
} from "../schemas/socketConnection.schema";

@Injectable()
export class SocketConnectionService {
  constructor(@InjectModel(SocketConnection_Def.name) private socketModel: Model<SocketConnectionDocument>) {}

  async addConnectedUser(connectedUser: SocketConnection): Promise<any> {
    let connection = await this.findConnectedUser(connectedUser.user_id);
    if (connection.length) {
      return this.socketModel.updateOne(
        { user_id: connectedUser.user_id },
        { $set: { socket_id: connectedUser.socket_id } }
      );
    } else {
      return this.socketModel.create(connectedUser);
    }
  }

  async findConnectedUser(userId: string): Promise<any> {
    return this.socketModel.find({ user_id: userId });
  }

  async removeConnectedUser(socketId: string): Promise<any> {
    return this.socketModel.deleteOne({ socket_id: socketId });
  }
}
