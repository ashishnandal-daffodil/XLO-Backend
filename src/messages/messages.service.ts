import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  
  messages:Message[]=[{name:'demo',text:'hi there'}];
  clientToUser = {};

  identify(name: string,clientId: string){
    this.clientToUser[clientId]=name;
    return Object.values(this.clientToUser);
     
  }

  getClientName(clientId: string){

    return this.clientToUser[clientId];
  }

  create(createMessageDto: CreateMessageDto, clientId: string) {
    console.log("client id ",clientId)

    console.log("data ",this.clientToUser)

    const message = {
      name: this.clientToUser[clientId],
      text: createMessageDto.text,
    }
    this.messages.push(message);
    return message; 
  }

  findAll() {
    console.log("check messages ",this.messages)
    return this.messages;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} message`;
  // }

  // update(id: number, updateMessageDto: UpdateMessageDto) {
  //   return `This action updates a #${id} message`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} message`;
  // }
}
