import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/services/user.controller';
import { TestController } from './test/test.controller';
import { CompController } from './comp/comp.controller';

@Module({
  imports: [],
  controllers: [AppController, TestController, CompController],
  providers: [AppService, UserService],
})
export class AppModule {}
