import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class userController {
  constructor(private readonly userService: UserService) {}

  @Get('get/:id')
  getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
