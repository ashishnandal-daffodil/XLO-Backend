/* eslint-disable prefer-const */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User as User_Def, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import {
  UserConnection as UserConnection_Def,
  UserConnectionDocument,
} from 'src/schemas/userConnection.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User_Def.name) private userModel: Model<UserDocument>,
    @InjectModel(UserConnection_Def.name)
    private userConnectionModel: Model<UserConnectionDocument>
  ) {}

  async findOne(param: any) {
    const filter = {};
    if (param && param.email) {
      filter["email"] = param.email;
    }
    if (param && param.mobile) {
      filter["mobile"] = param.mobile;
    }
    if (param && param._id) {
      filter["_id"] = param._id;
    }

    const user = await this.userModel.findOne(filter);

    return user;
  }

  async create(userData) {
    const { password } = userData || {};

    const saltOrRounds = 10;
    const enc_pass = await bcrypt.hash(password, saltOrRounds);

    const insertData = {
      mobile: '',
      email: '',
      name: '',
      about:'',
      created_on: new Date(),
      updated_on: new Date(),
      ...userData,
      password: enc_pass
    };
    const user = await this.userModel.insertMany(insertData);
    return user && user[0];
  }

  async update(params: any) {
    let { _id: userId, changes } = params || {};

    changes = { ...changes, updated_on: new Date() };

    const user = await this.userModel.findByIdAndUpdate({ _id: userId }, changes, { new: true });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async getByToken(token) {
    const connection = await this.findUserConnection({ token });

    if (connection && connection.user) {
      const user = await this.findOne({ _id: connection.user });
      const { _id, name, email, mobile, created_on, updated_on } = user || {};
      return { user: { _id, name, email, mobile, created_on, updated_on } };
    }

    return {};
  }

  async findUserConnection(param: any) {
    const filter = {};
    if (param && param.token) {
      filter["token"] = param.token;
    } else {
      return;
    }

    const connection = await this.userConnectionModel.findOne(filter);

    return connection;
  }

  async createToken(userData) {
    const { token, user } = userData || {};

    const insertData = {
      token,
      user,
      lastUpdatedOn: new Date()
    };
    await this.userConnectionModel.insertMany(insertData);
  }

  async logout(params) {
    if (params && params.token) {
      await this.userConnectionModel.deleteOne({ token: params.token });
    }
  }
}
