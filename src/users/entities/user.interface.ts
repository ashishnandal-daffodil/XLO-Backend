import { Room } from "src/schemas/room.schema";

export interface UserI {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
  created_on?: Date;
  updated_on?: Date;
  rooms?: Room[];
}
