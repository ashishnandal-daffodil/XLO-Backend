import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(phone: string, email: string, password: string) {
    let param = email ? { email: email } : { mobile: phone };
    const user: any = await this.usersService.findOne(param);

    let token = randomUUID();
    if (user && (await bcrypt.compare(password, user.password))) {
      let { _id, name } = user || {};

      await this.usersService.createToken({ token, user: { _id } });
      return { user: { _id, name }, message: 'Old User', token: token };
    } else if (!user) {
      // create new user
      const user: any = await this.usersService.create({
        ...param,
        password,
      });
      let { _id, name } = user || {};
      await this.usersService.createToken({ token, user: { _id } });
      return { user: { _id, name }, message: 'New User', token: token };
    }
    return null;
  }
}
