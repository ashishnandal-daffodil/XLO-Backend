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

  async createRoom(room: Room, creator: User): Promise<Room> {
    creator["_id"] = String(creator["_id"]);
    const newRoom = await this.addCreatorToRoom(room, creator);
    const roomName = newRoom.users.reduce(function (prevValue, currentValue) {
      return currentValue["_id"] + prevValue;
    }, "");
    newRoom.name = roomName;
    return this.roomModel.create(newRoom);
  }

  async addCreatorToRoom(room: Room, creator: User): Promise<Room> {
    room.users.push(creator);
    return room;
  }

  async getRoomsForUser(userId): Promise<any> {
    const query = this.roomModel.find({ "users._id": String(userId) }, { "messages": 0 }).sort({ "created_on": -1 });
    return query;
  }

  async getChatForRoom(roomId: number, user: User): Promise<any> {
    const query = this.roomModel.findById(roomId, { "messages": 1 });
    return query;
  }

  async sendMessage(message: string, roomId: number, user: User): Promise<any> {
    let currentDateAndTime = moment().format("LT");
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
}
