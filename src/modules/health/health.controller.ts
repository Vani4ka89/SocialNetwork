import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { HealthService } from './services/health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Server health' })
  @Get()
  public async getHealth(): Promise<string> {
    return await this.healthService.getHealth();
  }
}
