import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { RoomService } from "./room.service";
import { CreateRoomDto } from "./dto/create-room-dto";
import { UpdateRoomDto } from "./dto/update-room-dto";
import { ObjectId } from "mongoose";
import { User } from "src/schemas/user.schema";

@Controller("room")
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto, creator: User) {
    return this.roomService.createRoom(createRoomDto, creator);
  }
}