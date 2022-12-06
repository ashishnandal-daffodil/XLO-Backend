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

  async pullNotification(userId, type, senderName): Promise<any> {
    await this.notificationModel.findOneAndUpdate(
      {
        userId: userId
      },
      {
        $pull: { "notifications": { "type": type, "senderName": senderName } }
      }
    );
    return this.notificationModel.find({ userId: userId });
  }

  async createMessageNotification(userId, data, senderName, roomId): Promise<any> {
    let messageNotification = {
      type: "message",
      messageCount: 1,
      roomId: roomId,
      senderName: senderName,
      created_on: data?.latest_message?.created_on
    };
    await this.notificationModel.findOneAndUpdate(
      { userId: userId },
      { $push: { notifications: messageNotification } },
      { upsert: true }
    );
    return this.notificationModel.find({ userId: userId });
  }

  async findNotification(userId, type, senderName): Promise<any> {
    return this.notificationModel.find({
      userId: userId,
      "notifications": { $elemMatch: { "type": type, "senderName": senderName } }
    });
  }

  async updateNotification(userId, type, senderName): Promise<any> {
    await this.notificationModel.findOneAndUpdate(
      {
        userId: userId,
        "notifications": { $elemMatch: { "type": type, "senderName": senderName } }
      },
      {
        $inc: { "notifications.$.messageCount": 1 }
      }
    );
    return this.notificationModel.find({ userId: userId });
  }

  async removeMessageNotifications(userId): Promise<any> {
    await this.notificationModel.findOneAndUpdate(
      {
        userId: userId
      },
      {
        $pull: { "notifications": { "type": "message" } }
      }
    );
    return this.notificationModel.find({ userId: userId });
  }
}
