import { Module } from '@nestjs/common';
import { StreamModule } from 'src/stream/stream.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [StreamModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
