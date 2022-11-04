import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class WalletEntity {
  @ObjectIdColumn()
  _id: string;

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
