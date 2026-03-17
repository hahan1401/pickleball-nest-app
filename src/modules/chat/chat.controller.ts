import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../domain/entities/user.entity';
import { ChatService } from './chat.service';

@Controller('api/chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // GET /api/chats
  @Get()
  findAll(@CurrentUser() user: UserEntity) {
    return this.chatService.getUserChats(user.id);
  }

  // POST /api/chats
  @Post()
  create(@CurrentUser() user: UserEntity, @Body() dto: any) {
    return this.chatService.createRoom(user.id, dto);
  }

  // GET /api/chats/:id/messages
  @Get(':id/messages')
  getMessages(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.chatService.getMessages(id, user.id);
  }

  // POST /api/chats/:id/messages
  @Post(':id/messages')
  sendMessage(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body() dto: any,
  ) {
    return this.chatService.sendMessage(id, user.id, dto);
  }
}
