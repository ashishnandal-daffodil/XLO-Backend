import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { SocketConnectionService } from "./socket-connection.service";

@Controller("socketConnection")
export class SocketConnectionController {
  constructor(private readonly socketConnectionService: SocketConnectionService) {}
}
