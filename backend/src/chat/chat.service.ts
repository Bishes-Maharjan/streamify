import { Injectable } from '@nestjs/common';
import { StreamService } from 'src/stream/stream.service';

@Injectable()
export class ChatService {
  constructor(private stream: StreamService) {}
  getStreamToken(id: string) {
    const token = this.stream.generateUserToken(id);

    return token;
  }
}
