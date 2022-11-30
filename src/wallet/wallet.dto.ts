import { IsNotEmpty } from 'class-validator';

export class CreateWalletDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  chainId: number;
}
