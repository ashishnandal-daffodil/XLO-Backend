import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';
import { Message } from './message.schema';

export type RoomDocument = Room & Document;

@Schema()
export class Room {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    users: User[];
    
    @Prop()
    messages: Message[];

    @Prop()
    latest_message: Message;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
