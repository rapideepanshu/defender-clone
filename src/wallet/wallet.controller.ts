import { CreateWalletDto } from './wallet.dto';
import { Controller, Post, Body, Get, Param, Headers } from '@nestjs/common';
import { Wallet } from './wallet.interface';
import { WalletService } from './wallet.service';

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
  ): Promise<Wallet> {
    return this.walletService.generateEthereumAddressAndKey(createWalletDto);
  }

  @Get('/private-key')
  getPrivateKey(@Headers() headers) {
    return this.walletService.getPrivateKey(headers['x-api-key']);
  }
}
