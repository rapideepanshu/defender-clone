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
    const { name, chainId } = createWalletDto;
    let network_name: string;
    if (chainId === 1) {
      network_name = 'mainnet';
    } else if (chainId === 5) {
      network_name = 'goerli';
    }
    const id = randomBytes(32).toString('hex');
    const privateKey = `0x${id}`;
    const provider = ethers.getDefaultProvider({
      chainId: chainId,
      name: network_name,
    });
    const wallet = new ethers.Wallet(privateKey, provider);
    const data = await this.generateApiKeyAndSecret();

    const new_wallet = this.walletRepository.create({
      name,
      address: wallet.address,
      privateKey,
      apiKey: data.key,
      apiSecret: data.secret,
      user,
      chainId,
    });

    await this.walletRepository.save(new_wallet);

    return { name, address: wallet.address, chainId };
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

    return { key, secret };
  }

  async getApiKey(
    address: string,
  ): Promise<{ api_key: string; api_secret: string }> {
    const wallet_data = await this.walletRepository.findOneBy({ address });
    if (!wallet_data) {
      throw new Error('Wallet address is not found');
    }

    return { api_key: wallet_data.apiKey, api_secret: wallet_data.apiSecret };
  }

  async getWalletBalance(relayer_id: string): Promise<string> {
    const wallet = await this.walletRepository.findOne({
      where: {
        relayer_id,
      },
    });

    let network_name: string;
    if (wallet.chainId === 1) {
      network_name = 'mainnet';
    } else if (wallet.chainId === 5) {
      network_name = 'goerli';
    }

    const provider = ethers.getDefaultProvider({
      chainId: wallet.chainId,
      name: network_name,
    });

    const balance: string = (
      await provider.getBalance(wallet.address)
    ).toString();
    return balance;
  }

  async getPrivateKey(apiKey: string): Promise<string> {
    const wallet = await this.walletRepository.findOne({
      where: { apiKey },
    });

    return wallet.privateKey;
  }

  async getUsersWallet(user: User): Promise<WalletEntity[]> {
    const wallet = await this.walletRepository.find({ where: { user } });
    return wallet;
  }
}
