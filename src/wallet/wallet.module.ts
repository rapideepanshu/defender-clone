import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { WalletEntity } from './wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
