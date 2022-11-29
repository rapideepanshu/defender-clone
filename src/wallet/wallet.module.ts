import { WalletMiddleware } from './wallet.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { WalletEntity } from './wallet.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity]), UsersModule],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(WalletMiddleware).forRoutes('wallet/private-key');
  }
}
