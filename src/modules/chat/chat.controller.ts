import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../domain/entities/user.entity';

@Controller('api/chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // GET /api/chats
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.chatService.getUserChats(user.id);
  }

  // POST /api/chats
  @Post()
  create(@CurrentUser() user: User, @Body() dto: any) {
    return this.chatService.createRoom(user.id, dto);
  }

  // GET /api/chats/:id/messages
  @Get(':id/messages')
  getMessages(@Param('id') id: string, @CurrentUser() user: User) {
    return this.chatService.getMessages(id, user.id);
  }

  // POST /api/chats/:id/messages
  @Post(':id/messages')
  sendMessage(@Param('id') id: string, @CurrentUser() user: User, @Body() dto: any) {
    return this.chatService.sendMessage(id, user.id, dto);
  }
}
