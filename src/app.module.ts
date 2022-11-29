import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletModule } from './wallet/wallet.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Podio123!',
      database: 'user_wallet',
      autoLoadEntities: true,
      synchronize: true,
    }),
    WalletModule,
    UsersModule,
  ],
})
export class AppModule {}
