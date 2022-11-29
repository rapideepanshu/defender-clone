import { CreateWalletDto } from './wallet.dto';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Wallet } from './wallet.interface';
import { WalletService } from './wallet.service';
import { GetUser } from 'src/users/get-user.decorator';
import { User } from 'src/users/users.entity';

@UseGuards(AuthGuard())
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get('/get-api-key/:address')
  async getApiKey(
    @Param('address') address: string,
  ): Promise<{ Apikey: string }> {
    return this.walletService.getApiKey(address);
  }

  @Post('/create-wallet')
  async createWalletandKey(
    @Body() createWalletDto: CreateWalletDto,
    @GetUser() user: User,
  ): Promise<Wallet> {
    return this.walletService.generateEthereumAddressAndKey(
      createWalletDto,
      user,
    );
  }

  @Get('/private-key')
  getPrivateKey(@Headers() headers) {
    return this.walletService.getPrivateKey(headers['x-api-key']);
  }
}
