import { NotFoundException } from '@nestjs/common';
import { RelayerParams } from './relayer-credential.type';
export class Relayer {
  constructor(private credentials: RelayerParams) {
    if (
      credentials.apiKey === undefined ||
      credentials.apiSecret === undefined
    ) {
      throw new NotFoundException('Invalid api key or secret');
    }
  }
}
