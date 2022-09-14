import {
  Controller,
  Patch,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/local-auth.guards';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /login
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): any {
    return req.user;
  }

  @Get('getbytoken')
  getUser(@Query() { token }) {
    return this.usersService.getByToken(token);
  }

  @Patch('update')
  update(@Body() updateUserData: UserDto) {
    return this.usersService.update(updateUserData);
  }
}
