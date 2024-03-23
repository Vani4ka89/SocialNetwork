import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  public async getHealth(): Promise<string> {
    return 'Hello! All is 👍!...';
  }
}
