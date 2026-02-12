import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  findById(id: string): { id: string; name: string } {
    return { id, name: 'User' };
  }
}
