import { CreateWalletDto } from './wallet.dto';
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { Wallet } from './wallet.interface';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get('/get-api-key-secret/:address')
  async getApiKeyAndSecret(
    @Param('address') address: string,
  ): Promise<{ Apikey: string; ApiSecret: string }> {
    return this.walletService.getApiKeyAndSecret(address);
  }

  @Post('/create-wallet')
  async createWalletandKey(
    @Body() createWalletDto: CreateWalletDto,
  ): Promise<Wallet> {
    return this.walletService.generateEthereumAddressAndKey(createWalletDto);
  }
}
