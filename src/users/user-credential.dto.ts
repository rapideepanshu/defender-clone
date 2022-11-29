import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserCredentialsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, {
    message: 'email is not valid',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}
