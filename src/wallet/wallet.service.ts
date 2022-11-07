import { WalletEntity } from './wallet.entity';
import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { randomBytes, scryptSync } from 'crypto';
import { Wallet } from './wallet.interface';
import { CreateWalletDto } from './wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private walletRepository: Repository<WalletEntity>,
  ) {}

  async generateEthereumAddressAndKey(
    createWalletDto: CreateWalletDto,
  ): Promise<Wallet> {
    const { name } = createWalletDto;
    const id = randomBytes(32).toString('hex');
    const privateKey = `0x${id}`;
    const provider = ethers.getDefaultProvider();
    const wallet = new ethers.Wallet(privateKey, provider);
    const data = await this.generateApiKeyAndSecret();

    const new_wallet = await this.walletRepository.create({
      name,
      address: wallet.address,
      privateKey,
      apiKey: data.key,
      apiSecret: data.secret,
      chain: '1',
    });

    await this.walletRepository.save(new_wallet);

    return { name, address: wallet.address, chain: '1' };
  }

  async generateApiKeyAndSecret(): Promise<{ key: string; secret: string }> {
    // api key
    const buffer = randomBytes(32);
    const key = buffer.toString('base64');
    // api secret
    const salt = randomBytes(8).toString('hex');
    const buffer2 = scryptSync(key, salt, 64);
    const secret = `${buffer2.toString('hex')}.${salt}`;
    console.log('secret', secret);
    return { key, secret };
  }

  async getApiKeyAndSecret(
    address: string,
  ): Promise<{ Apikey: string; ApiSecret: string }> {
    const wallet_data = await this.walletRepository.findOneBy({ address });
    if (!wallet_data) {
      throw new Error('Wallet address is not found');
    }

    return { Apikey: wallet_data.apiKey, ApiSecret: wallet_data.apiSecret };
  }
}
