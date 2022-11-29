import { UsersRepository } from './users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserJWT } from './user-jwt.interface';
import { User } from './users.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
  ) {
    super({
      secretOrKey: 'HighLevelSecr@t',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: UserJWT): Promise<User> {
    const { email } = payload;
    const user: User = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
