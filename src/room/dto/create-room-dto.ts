import { Message } from "src/schemas/message.schema";
import { User } from "src/schemas/user.schema";

export class CreateRoomDto {
    id: number;
    name: string;
    description: string;
    users: User[];
    messages: Message[];
    created_at: Date;
    updated_at: Date;
  }
  