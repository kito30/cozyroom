import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user/services/user.service';
import { UserController } from './user/controller/user.controller';
import { ChatService } from './chat/services/chat.service';
import { ChatController } from './chat/controller/chat.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [UserController, ChatController],
  providers: [UserService, ChatService],
})
export class AppModule {}

