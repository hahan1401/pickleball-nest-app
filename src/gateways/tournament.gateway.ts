import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/tournament', cors: true })
export class TournamentGateway {
  @WebSocketServer() server: Server;
}
