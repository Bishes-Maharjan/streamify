// src/stream/stream.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { StreamChat } from 'stream-chat';

@Injectable()
export class StreamService implements OnModuleInit {
  private client: StreamChat;

  onModuleInit() {
    this.client = StreamChat.getInstance(
      process.env.STREAM_API_KEY ?? '123',
      process.env.STREAM_API_SECRET,
    );
  }

  // Create or update a user in Stream
  async upsertUser(user: { id: string; name?: string; image?: string }) {
    const result = await this.client.upsertUser(user);
    if (!result) throw new Error(result);
    return result;
  }

  // Generate token for client-side SDK authentication
  generateUserToken(userId: string): string {
    return this.client.createToken(userId);
  }

  // Create or get a channel for chat
  async createChannel(type: string, channelId: string, members: string[]) {
    const channel = this.client.channel(type, channelId, { members });
    await channel.create();
    return channel;
  }
  async deleteAllUser() {
    const response = await this.client.queryUsers({});

    const users = response.users.filter(
      (user) => user.id !== 'bishes-maharjan',
    );

    // 2. Loop through users and delete them
    for (const user of users) {
      await this.client.deleteUser(user.id, { hard_delete: true });
    }

    return { deleted: users.length };
  }
}
