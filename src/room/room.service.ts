import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Room, Room as Room_Def, RoomDocument } from "../schemas/room.schema";
import { User } from "src/schemas/user.schema";

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room_Def.name) private roomModel: Model<RoomDocument>) {}

  async createRoom(room: Room, creator: User): Promise<Room> {
    const newRoom = await this.addCreatorToRoom(room, creator);
    return this.roomModel.create(newRoom);
  }

  async addCreatorToRoom(room: Room, creator: User): Promise<Room> {
    console.log("🚀 ~ file: room.service.ts ~ line 17 ~ RoomService ~ addCreatorToRoom ~ room", room)
    room.users.push(creator);
    return room;
  }

  async getRoomsForUser(userId: number) {
    const query = this.roomModel.find({ "users._id": userId }, { "messages": 0 }).sort({ "created_on": 1 });
    return query;
  }

  async getChatForRoom(roomId: number, user: User) {
    const query = this.roomModel.findById(roomId, { "messages": 1 });
    return query;
  }

  async sendMessage(message: string, roomId: number, user: User) {
    let messageObj = {
      message: message,
      sender: user["_id"],
      created_on: new Date(),
      updated_on: new Date()
    };
    const query = this.roomModel.findByIdAndUpdate(roomId, { $push: { messages: messageObj }, $set: {latest_message: messageObj} });
    return query;
  }
}
