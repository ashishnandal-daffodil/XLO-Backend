import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Query,
  Put,
  UseInterceptors,
  UploadedFile,
  Param,
  Res
} from "@nestjs/common";
import { LocalAuthGuard } from "src/auth/local-auth.guards";
import { UserDto } from "./dto/user.dto";
import { UsersService } from "./users.service";
import { diskStorage } from "multer";
import path = require("path");
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { FileInterceptor } from "@nestjs/platform-express";
import { Observable, of, tap } from "rxjs";
import { Image } from "./image.interface";
import { MailService } from "src/services/mail/mail.service";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export const storage = {
  storage: diskStorage({
    destination: "./uploads/profileimages",
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, "") + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    }
  })
};

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private mailService: MailService,
    private configService: ConfigService
  ) {}

  // POST /login
  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req): any {
    return req.user;
  }

  @Get("getbytoken")
  getUser(@Query() { token }) {
    return this.usersService.getByToken(token);
  }

  @Get("getDetails")
  getUserData(@Query() { userId }) {
    return this.usersService.getUserDataById(userId);
  }

  @Get("forgotPassword")
  async getPasswordChangeLink(@Query() { registeredEmailAddress, passwordChangeLink }) {
    let resetPasswordToken = randomUUID();
    let newPasswordChangeLink = `${passwordChangeLink}?token=${resetPasswordToken}`;
    await this.usersService.insertResetPasswordToken(registeredEmailAddress, resetPasswordToken);
    return await this.mailService.sendMail(
      { receiver: registeredEmailAddress, resetPasswordLink: newPasswordChangeLink },
      "forgotPassword"
    );
  }

  @Get("verifyResetPasswordToken")
  async verifyResetPasswordToken(@Query() { resetPasswordToken }) {
    let user = await this.usersService.verifyResetPasswordToken(resetPasswordToken);
    return user;
  }

  @Put("removeResetPasswordToken")
  async removeResetPasswordToken(@Body() { resetPasswordToken }) {
    let user = await this.usersService.removeResetPasswordToken(resetPasswordToken);
    return user;
  }

  @Put("changePassword")
  changePassword(@Body() { registeredEmailAddress, newPassword }) {
    return this.usersService.changePassword(registeredEmailAddress, newPassword);
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file", storage))
  uploadFile(@UploadedFile() file, @Request() req) {
    let params = {
      _id: req.body._id,
      changes: {
        profile_image_filename: file.filename
      }
    };
    return this.usersService.update(params);
  }

  @Get("profileimage/:imagename")
  findProfileImage(@Param("imagename") imagename, @Res() res): Observable<Object> {
    return of(res.sendFile(join(process.cwd(), "uploads/profileimages/" + imagename)));
  }

  @Put("update")
  update(@Body() updateUserData: UserDto) {
    return this.usersService.update(updateUserData);
  }

  @Put("deleteprofileimage")
  deleteprofileimage(@Body() data) {
    return this.usersService.deleteprofileimage(data);
  }

  @Post("logout")
  logout(@Body() { token }) {
    return this.usersService.logout({ token });
  }
}
