import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import { Repository } from 'typeorm';
import { WalletEntity } from './wallet.entity';
import { timingSafeEqual, scryptSync } from 'crypto';

@Injectable()
export class WalletMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(WalletEntity)
    private walletRepository: Repository<WalletEntity>,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const suppliedKey: string = req.headers['x-api-key'] as any;
    console.log(suppliedKey);

    const wallet = await this.walletRepository.findOne({
      where: { apiKey: suppliedKey },
    });

    if (wallet) {
      const [hashedPassword, salt] = wallet.apiSecret.split('.');

      const buffer = scryptSync(suppliedKey, salt, 64);
      const result = timingSafeEqual(
        Buffer.from(hashedPassword, 'hex'),
        buffer,
      );
      if (result) next();
    } else {
      throw new NotFoundException('wallet not found');
    }
  }
}
