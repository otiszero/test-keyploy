import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

class WsExceptionFilter {
  catch(exception: WsException, host: any) {
    const client = host.switchToWs().getClient();
    client.emit('error', { message: exception.message });
  }
}

@WebSocketGateway({ cors: { origin: '*', credentials: true } })
@UseFilters(new WsExceptionFilter())
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private logger = new Logger('ChatGateway');

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) {
        this.logger.warn(`Client ${client.id} rejected: No token`);
        client.emit('error', { message: 'Không tìm thấy token xác thực' });
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, displayName: true },
      });
      if (!user) {
        client.emit('error', { message: 'User not found' });
        client.disconnect();
        return;
      }
      (client as any).user = user;
      this.logger.log(`Client connected: ${client.id} (${user.displayName})`);
    } catch {
      this.logger.warn(`Client ${client.id} rejected: Invalid token`);
      client.emit('error', { message: 'Token không hợp lệ hoặc đã hết hạn' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async handleSendMessage(
    @MessageBody() dto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = (client as any).user;
    if (!user) {
      throw new WsException('Unauthorized');
    }
    const trimmed = dto.content.trim();
    if (!trimmed) {
      throw new WsException('Nội dung tin nhắn không được chỉ chứa khoảng trắng');
    }
    const message = await this.chatService.createMessage(user.id, trimmed);
    this.server.emit('new_message', message);
    return message;
  }

  @SubscribeMessage('get_recent_messages')
  async handleGetRecentMessages(@ConnectedSocket() client: Socket) {
    const user = (client as any).user;
    if (!user) {
      throw new WsException('Unauthorized');
    }
    return this.chatService.getRecentMessages(50);
  }
}
