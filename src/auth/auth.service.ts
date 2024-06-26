import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userService.findOne(email);
    const passIsMath = await argon2.verify(user.password, pass);
    if (user && passIsMath) {
      return user;
    }
    throw new UnauthorizedException('User or password incorrect');
  }

  async login(user: IUser) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
