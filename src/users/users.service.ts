import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User as User_Def, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User_Def.name) private userModel: Model<UserDocument>,
  ) {}

  async findOne(param: any) {
    let filter = {};
    if (param && param.email) {
      filter['email'] = param.email;
    }
    if (param && param.mobile) {
      filter['mobile'] = param.mobile;
    }

    let user = await this.userModel.findOne(filter);

    return user;
  }

  async create(userData) {
    let { password } = userData || {};

    const saltOrRounds = 10;
    const enc_pass = await bcrypt.hash(password, saltOrRounds);

    let insertData = {
      mobile: '',
      email: '',
      name: '',
      created_on: new Date(),
      updated_on: new Date(),
      ...userData,
      password: enc_pass,
    };
    let user = await this.userModel.insertMany(insertData);
    return user && user[0];
  }
}
