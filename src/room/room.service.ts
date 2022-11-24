import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Room, Room as Room_Def, RoomDocument } from "../schemas/room.schema";
import { User } from "src/schemas/user.schema";
import * as moment from "moment";
import { Socket } from "socket.io";

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room_Def.name) private roomModel: Model<RoomDocument>) {}

  async createRoom(room: Room): Promise<Room> {
    const roomName = `${room.buyer_id}${room.seller_id}`;
    room.name = roomName;
    return this.roomModel.create(room);
  }

  async getAllMyRooms(userId): Promise<any> {
    const query = this.roomModel.find(
      { $or: [{ "buyer_id": userId }, { "seller_id": userId }] },
      { buyer_id: 1, seller_id: 1, _id: 0 }
    );
    return query;
  }

  // async addCreatorToRoom(room: Room, creator: User): Promise<Room> {
  //   room.users.push(creator);
  //   return room;
  // }

  async getRoomsForUserAsBuyer(userId): Promise<any> {
    const query = this.roomModel.find({ "buyer_id": String(userId) }, { "messages": 0 }).sort({ "created_on": -1 });
    return query;
  }

  async getRoomsForUserAsSeller(userId): Promise<any> {
    const query = this.roomModel.find({ "seller_id": String(userId) }, { "messages": 0 }).sort({ "created_on": -1 });
    return query;
  }

  async getChatForRoom(roomId: number, user: User): Promise<any> {
    const query = this.roomModel.findById(roomId, { "messages": 1 });
    return query;
  }

  async sendMessage(message: string, roomId: number, user: User): Promise<any> {
    let currentDateAndTime = moment().format("LLL");
    let messageObj = {
      message: message,
      sender: user["_id"],
      created_on: currentDateAndTime,
      updated_on: currentDateAndTime
    };
    const query = this.roomModel.findByIdAndUpdate(roomId, {
      $push: { messages: messageObj },
      $set: { latest_message: messageObj }
    });
    return query;
  }

  async getLatestMessage(roomId: number): Promise<any> {
    return this.roomModel.findById(roomId, { latest_message: 1, _id: 0 });
  }

  async getRoomInfo(roomId: number): Promise<any> {
    return this.roomModel.findById(roomId);
  }
}
