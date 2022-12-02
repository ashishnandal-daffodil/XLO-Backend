import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UsersService } from "src/users/users.service";
import { Notification as Notifications_Def, NotificationDocument } from "../schemas/notifications.schema";

@Injectable()
export class NotificationsService {
  collation = { locale: "en", strength: 2 };
  constructor(
    @InjectModel(Notifications_Def.name) private notificationModel: Model<NotificationDocument>,
    private usersService: UsersService
  ) {}

  async pushNotification(userId, notification): Promise<any> {
    return this.notificationModel.updateOne({ userId: userId }, { $push: { notifications: notification } });
  }

  async getAllMyNotifications(userId): Promise<any> {
    return this.notificationModel.find({ userId: userId });
  }

  async popNotifications(userId): Promise<any> {
    return this.notificationModel.updateOne({ userId: userId }, { $set: { notifications: [] } });
  }

  async createMessageNotification(userId, data, senderName): Promise<any> {
    let messageNotification = {
      type: "message",
      notification: {
        messageCount: 1,
        senderName: senderName
      },
      created_on: data?.latest_message?.created_on
    };
    return this.notificationModel.findOneAndUpdate(
      { userId: userId },
      { $push: { notifications: messageNotification } },
      { upsert: true, new: true }
    );
  }

  async findNotification(userId, type, senderName): Promise<any> {
    return this.notificationModel.find({
      userId: userId,
      "notifications": { $elemMatch: { "type": type, "notification.senderName": senderName } }
    });
  }

  async updateNotification(userId, type, senderName): Promise<any> {
    return this.notificationModel.findOneAndUpdate(
      {
        userId: userId,
        "notifications": { $elemMatch: { "type": type, "notification.senderName": senderName } }
      },
      {
        $inc: { "notifications.$.notification.messageCount": 1 }
      },
      { new: true }
    );
  }
}
