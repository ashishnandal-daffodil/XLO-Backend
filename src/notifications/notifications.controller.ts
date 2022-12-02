import { Body, Controller, Get, Post, Put, Query } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
export class NotificationsController {
  constructor(private notficationService: NotificationsService) {}

  @Post("pushNotification")
  async pushNotification(@Body() body: any) {
    let notification = {};
    notification["type"] = body.type;
    notification["notification"] = body.notification;
    notification["created_on"] = new Date();
    return this.notficationService.pushNotification(body.userId, notification);
  }

  @Put("popNotifications")
  async popNotifications(@Body() body: any) {
    return this.notficationService.popNotifications(body.userId);
  }

  @Get("myNotifications")
  async getAllMyNotifications(@Query() body: any) {
    return this.notficationService.getAllMyNotifications(body.userId);
  }
}
