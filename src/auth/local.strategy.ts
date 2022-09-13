import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ passReqToCallback: true });
  }

  async validate(req: any): Promise<any> {
    let phone = req && req.body && req.body.phone;
    let email = req && req.body && req.body.email;
    let password = req && req.body && req.body.password;

    const { user, message } =
      (await this.authService.validateUser(phone, email, password)) || {};

    if (!user) {
      throw new UnauthorizedException();
    }

    return { user, message };
  }
}
