import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { TagResponseDto } from './models/dto/response/tag.response.dto';
import { TagService } from './services/tag.service';

@ApiTags('Tag')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Find popular tags' })
  @Get('popular')
  public async getPopular(): Promise<TagResponseDto[]> {
    return await this.tagService.getPopular();
  }
}