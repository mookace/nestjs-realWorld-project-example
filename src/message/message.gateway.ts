import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { MessageService } from './message.service';

@ApiBearerAuth()
@ApiTags('message')
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@WebSocketGateway()
export class MessageGateway implements OnModuleInit {
  constructor(private readonly messagesService: MessageService) {}
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('socket id', socket.id);
      // this.server.emit("hello", "world");
    });
  }

  @SubscribeMessage('newMessage')
  async create(@MessageBody() body: CreateMessageDto): Promise<any> {
    // console.log('see client', client.handshake.headers.authorization);
    const message = await this.messagesService.create(body);
    this.server.emit('onMessage', {
      msg: 'Send Message Successfully',
      data: message,
      status: 'success',
    });

    await this.messagesService.saveHistory(message);
    return message;
  }

  // @SubscribeMessage('findAllMessages')
  // async findAll(): Promise<any> {
  //   console.log('enter find all');
  //   const data = await this.messagesService.findAll();
  //   this.server.emit('all', data);
  //   return data;
  // }

  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket
  ) {
    return this.messagesService.identify(name, client.id);
  }

  @SubscribeMessage('typing')
  //client is the message sender
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket
  ) {
    console.log('client', client.handshake.headers.authorization);
    const auth = client.handshake.headers.authorization;
    const name = await this.messagesService.getClientByName(auth);
    console.log('name', name);
    client.broadcast.emit('typing', { name, isTyping });
    // const name = await this.messagesService.getClientByName(client.id);
    // client.broadcast.emit('typing', { name, isTyping });
  }
}
