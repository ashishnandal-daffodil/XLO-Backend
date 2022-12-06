import { Body, Controller, Get, Post, Put, Query } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { ChatGateway } from "src/chat/gateway/chat.gateway";
import { SocketConnectionService } from "src/socket-connection/socket-connection.service";

@Controller("notifications")
export class NotificationsController {
  constructor(
    private notficationService: NotificationsService,
    private chatGateway: ChatGateway,
    private socketConnectionService: SocketConnectionService
  ) {}

  @Put("pullNotification")
  async pullNotification(@Body() body: any) {
    let notifications = await this.notficationService.pullNotification(body.userId, body.type, body.senderName);
    return this.findSocketIdAndEmitNotifications(body.userId, notifications);
  }

  @Get("myNotifications")
  async getAllMyNotifications(@Query() body: any) {
    return await this.notficationService.getAllMyNotifications(body.userId);
  }

  @Put("removeMessageNotifications")
  async removeMessageNotifications(@Body() body: any) {
    let notifications = await this.notficationService.removeMessageNotifications(body.userId);
    return this.findSocketIdAndEmitNotifications(body.userId, notifications);
  }

  async findSocketIdAndEmitNotifications(userId, notifications) {
    let socketConnection = await this.socketConnectionService.findConnectedUser(userId);
    let socketId = socketConnection.length && socketConnection[0].socket_id;
    if (socketId) {
      return this.chatGateway.server.to(socketId).emit("notifications", notifications);
    } else {
      return notifications;
    }
  }
}
