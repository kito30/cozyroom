import { Module } from '@nestjs/common';
import { UserService } from './user/services/user.service';
import { UserController } from './user/controller/user.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
