import { Injectable } from '@nestjs/common';

interface User {
  id: number;
  username: string;
  password: string;
}

@Injectable()
export class UsersService {
  private readonly hardcodedUser: User = {
    id: 1,
    username: process.env.TEST_USERNAME || 'testuser',
    password: process.env.TEST_PASSWORD || 'password123',
  };

  async findById(id: number): Promise<User | undefined> {
    return id === this.hardcodedUser.id ? this.hardcodedUser : undefined;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return username === this.hardcodedUser.username
      ? this.hardcodedUser
      : undefined;
  }

  async validateCredentials(
    username: string,
    password: string,
  ): Promise<User | null> {
    if (
      username === this.hardcodedUser.username &&
      password === this.hardcodedUser.password
    ) {
      return this.hardcodedUser;
    }
    return null;
  }
}
