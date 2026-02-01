import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import type { MessageDto } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(userId: string, content: string): Promise<MessageDto> {
    const message = await this.prisma.message.create({
      data: { content, senderId: userId },
      include: { sender: { select: { displayName: true } } },
    });
    return {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      senderDisplayName: message.sender.displayName,
      createdAt: message.createdAt,
    };
  }

  async getRecentMessages(limit: number = 50): Promise<MessageDto[]> {
    const messages = await this.prisma.message.findMany({
      take: limit,
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { displayName: true } } },
    });
    return messages.map((m) => ({
      id: m.id,
      content: m.content,
      senderId: m.senderId,
      senderDisplayName: m.sender.displayName,
      createdAt: m.createdAt,
    }));
  }
}
