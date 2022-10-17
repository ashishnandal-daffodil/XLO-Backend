import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string ,phone: string, email: string, password: string) {
    let param = email ? { email: email } : { mobile: phone };
    const user: any = await this.usersService.findOne(param);

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = await this.login(user);
      let { _id, name } = user || {};
      await this.usersService.createToken({ token, user: { _id } });
      return { user: { _id, name }, message: 'Old User', token: token };
    } else if (!user) {
      // create new user
      const user: any = await this.usersService.create({
        ...param,
        phone,
        username,
        password,
      
      });
      const token = await this.login(user);
      let { _id, name } = user || {};
      await this.usersService.createToken({ token, user: { _id } });
      return { user: { _id, name }, message: 'New User', token: token };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.name, sub: user._id };

    return this.jwtService.sign(payload);
  }
}
