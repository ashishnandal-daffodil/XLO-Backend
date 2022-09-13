import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(phone: string, email: string, password: string) {
    let param = email ? { email: email } : { mobile: phone };
    const user: any = await this.usersService.findOne(param);

    if (user && (await bcrypt.compare(password, user.password))) {
      let { _id, name } = user || {};

      return { user: { _id, name }, message: 'Old User' };
    } else if (!user) {
      // create new user
      const user: any = await this.usersService.create({
        ...param,
        password,
      });
      let { _id, name } = user || {};
      return { user: { _id, name }, message: 'New User' };
    }
    return;
  }
}
