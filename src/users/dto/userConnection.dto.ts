import { User } from 'src/schemas/user.schema';

export class UserConnectionDto {
  token: string;
  lastUpdatedOn: Date;
  user: User;
}
