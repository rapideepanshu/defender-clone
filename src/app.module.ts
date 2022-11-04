import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from './wallet/wallet.entity';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost/wallets',
      synchronize: true,
      useUnifiedTopology: true,
      entities: [WalletEntity],
    }),
    WalletModule,
  ],
})
export class AppModule {}
