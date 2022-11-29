import { UserCredentialsDto } from './user-credential.dto';
import { UsersService } from './users.service';

import { Body, Controller, Post } from '@nestjs/common';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signUp')
  signUp(@Body() userCredentialsDto: UserCredentialsDto): Promise<void> {
    return this.userService.signUp(userCredentialsDto);
  }

  @Post('/signIn')
  signIn(
    @Body() userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.userService.signIn(userCredentialsDto);
  }
}
