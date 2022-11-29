import { WalletEntity } from './wallet.entity';
import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { randomBytes, scryptSync } from 'crypto';
import { Wallet } from './wallet.interface';
import { CreateWalletDto } from './wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private walletRepository: Repository<WalletEntity>,
  ) {}

  async generateEthereumAddressAndKey(
    createWalletDto: CreateWalletDto,
    user: User,
  ): Promise<Wallet> {
    const { name } = createWalletDto;
    const id = randomBytes(32).toString('hex');
    const privateKey = `0x${id}`;
    const provider = ethers.getDefaultProvider();
    const wallet = new ethers.Wallet(privateKey, provider);
    const data = await this.generateApiKeyAndSecret();

    const new_wallet = this.walletRepository.create({
      name,
      address: wallet.address,
      privateKey,
      apiKey: data.key,
      apiSecret: data.secret,
      balance: (await provider.getBalance(wallet.address)).toString(),
      user,
    });

    await this.walletRepository.save(new_wallet);

    return { name, address: wallet.address, balance: new_wallet.balance };
  }

  async generateApiKeyAndSecret(): Promise<{
    key: string;
    secret: string;
  }> {
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

  async getApiKey(address: string): Promise<{ Apikey: string }> {
    const wallet_data = await this.walletRepository.findOneBy({ address });
    if (!wallet_data) {
      throw new Error('Wallet address is not found');
    }

    return { Apikey: wallet_data.apiKey };
  }

  async getPrivateKey(apiKey: string) {
    const wallet = await this.walletRepository.findOne({
      where: { apiKey },
    });

    return wallet.privateKey;
  }
}
