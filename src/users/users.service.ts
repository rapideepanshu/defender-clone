import { UserCredentialsDto } from './user-credential.dto';
import { UsersRepository } from './users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserJWT } from './user-jwt.interface';
@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(userCredentialsDto: UserCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(userCredentialsDto);
  }

  async signIn(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = userCredentialsDto;
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: UserJWT = { email };
      const accessToken = this.jwtService.sign({ payload });
      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid Credentials');
    }
  }
}
