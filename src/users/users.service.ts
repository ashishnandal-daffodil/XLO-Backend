import { Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User as User_Def, UserDocument } from "src/schemas/user.schema";
import * as bcrypt from "bcrypt";
import { UserConnection as UserConnection_Def, UserConnectionDocument } from "src/schemas/userConnection.schema";
import { unlink } from "fs";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User_Def.name) private userModel: Model<UserDocument>,
    @InjectModel(UserConnection_Def.name)
    private userConnectionModel: Model<UserConnectionDocument>
  ) {}

  async findOne(param: any) {
    let filter = {};
    if (param && param.email) {
      filter["email"] = param.email;
    }
    if (param && param.mobile) {
      filter["mobile"] = param.mobile;
    }
    if (param && param._id) {
      filter["_id"] = param._id;
    }

    let user = await this.userModel.findOne(filter);

    return user;
  }

  async create(userData) {
    let { password } = userData || {};

    const saltOrRounds = 10;
    const enc_pass = await bcrypt.hash(password, saltOrRounds);

    let insertData = {
      mobile: "",
      email: "",
      name: "",
      created_on: new Date(),
      updated_on: new Date(),
      ...userData,
      password: enc_pass
    };
    let user = await this.userModel.insertMany(insertData);
    return user && user[0];
  }

  async update(params: any) {
    let { _id: userId, changes } = params || {};

    changes = { ...changes, updated_on: new Date() };

    const user = await this.userModel.findByIdAndUpdate({ _id: userId }, changes, { new: true });
    if (!user) {
      throw new NotFoundException();
    }
    let { _id, name, email, mobile, about_me, profile_image_filename } = user || {};
    return { _id, name, email, mobile, about_me, profile_image_filename };
  }

  async getByToken(token) {
    let connection = await this.findUserConnection({ token });

    if (connection && connection.user) {
      let user = await this.findOne({ _id: connection.user });
      let { _id, name, email, mobile, created_on, updated_on } = user || {};
      return { _id, name, email, mobile, created_on, updated_on };
    }

    return {};
  }

  async getUserDataById(userId) {
    let user = await this.findOne({ _id: userId });
    let { _id, name, email, mobile, created_on, updated_on, profile_image_filename } = user || {};
    return { _id, name, email, mobile, created_on, updated_on, profile_image_filename };
  }

  async findUserConnection(param: any) {
    let filter = {};
    if (param && param.token) {
      filter["token"] = param.token;
    } else {
      return;
    }

    let connection = await this.userConnectionModel.findOne(filter);

    return connection;
  }

  async createToken(userData) {
    let { token, user } = userData || {};

    let insertData = {
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

  async deleteprofileimage(params) {
    let { _id, profile_image_filename } = params || {};
    unlink(`uploads/profileimages/${profile_image_filename}`, err => {
      if (err) throw err;
    });
    let updateInfo = {
      _id: _id,
      changes: {
        profile_image_filename: null
      }
    };
    return this.update(updateInfo);
  }
}
