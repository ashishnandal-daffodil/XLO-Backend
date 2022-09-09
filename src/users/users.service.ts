import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User as User_Def, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User_Def.name) private userModel: Model<UserDocument>,
  ) {}

  async findOne(email: string) {
    let user = await this.userModel.findOne({ email: email });
    return user;
  }

  async create(userData) {
    let insertData = {
      mobile: '',
      email: '',
      name: '',
      created_on: new Date(),
      updated_on: new Date(),
      ...userData,
    };
    let user = await this.userModel.insertMany(insertData);
    return user && user[0];
  }
}
