import { Repository, DataSource } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { User } from './users.entity';
import { UserCredentialsDto } from './user-credential.dto';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(userCredentialsDto: UserCredentialsDto): Promise<void> {
    const { email, password } = userCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ email, password: hashedPassword });
    try {
      await this.save(user);
    } catch (error) {
      console.log(error);
      if (error.code === '23505')
        throw new ConflictException('Email already exists');
      else throw new InternalServerErrorException();
    }
  }
}
