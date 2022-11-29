import { BigNumber } from 'ethers';
import { User } from 'src/users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wallet')
export class WalletEntity {
  @PrimaryGeneratedColumn()
  relayer_id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  privateKey: string;

  @Column()
  apiKey: string;

  @Column()
  apiSecret: string;

  @Column()
  balance: string;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;
}
