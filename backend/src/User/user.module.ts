import { Module } from '@nestjs/common';
import { userController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [userController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
