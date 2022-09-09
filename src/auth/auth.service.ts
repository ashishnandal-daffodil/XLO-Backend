import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const user: any = await this.usersService.findOne(email);

    if (user && user.password === password) {
      let { _id, name } = user || {};

      return { user: { _id, name }, message: 'Old User' };
    } else if (!user) {
      // create new user
      const user: any = await this.usersService.create({ email, password });
      let { _id, name } = user || {};
      return { user: { _id, name }, message: 'New User' };
    }
    return;
  }
}
