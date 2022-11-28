import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wallet')
export class WalletEntity {
  @PrimaryGeneratedColumn()
  id: string;

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
  chain: string;
}
