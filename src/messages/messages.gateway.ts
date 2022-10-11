
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server,Socket} from 'socket.io';
import { UpdateMessageDto } from './dto/update-message.dto';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway(8001,{
  cors:{
    origin:"*",
  },
})
export class MessagesGateway {

  @WebSocketServer()
  server:Server;
   
  constructor(private readonly messagesService: MessagesService) {}

  // async handleConnection(socket: Socket) {
  //   try {
  //     console.log("🚀 ~ file: messages.gateway.ts ~ line 21 ~ MessagesGateway ~ handleConnection ~ socket", socket.id)
  //   } catch {
  //     return this.disconnect(socket);
  //   }
  // }

  // private disconnect(socket: Socket) {
  //   socket.emit("Error", new UnauthorizedException());
  //   socket.disconnect();
  // }

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto,@ConnectedSocket() client:Socket) {
    console.log("body ",createMessageDto)
    const message = await this.messagesService.create(createMessageDto,client.id);
    console.log("client id 1 ",client.id)
    this.server.emit('message',message)
    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('join')
  joinRoom(@MessageBody('name') name:string,@ConnectedSocket() client: Socket){
     console.log("name in backend",name);
    return this.messagesService.identify(name,client.id);
    
  }

  @SubscribeMessage('typing')
  async typing(@MessageBody('isTyping') isTyping: boolean,@ConnectedSocket() client:Socket,){
        const name = await this.messagesService.getClientName(client.id);
        client.broadcast.emit('typing',{name,isTyping}); 
      }

  // @SubscribeMessage('findOneMessage')
  // findOne(@MessageBody() id: number) {
  //   return this.messagesService.findOne(id);
  // }

  // @SubscribeMessage('updateMessage')
  // update(@MessageBody() updateMessageDto: UpdateMessageDto) {
  //   return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  // }

  // @SubscribeMessage('removeMessage')
  // remove(@MessageBody() id: number) {
  //   return this.messagesService.remove(id);
  // }
}
