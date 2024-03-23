import { Exclude } from 'class-transformer';

import { TokenResponseDto } from './token.response.dto';

@Exclude()
export class AuthUserResponseDto {
  id: string;
  name: string;
  email: string;
  bio: string;
  image: string;
  created: Date;
  updated: Date;
  tokens: TokenResponseDto;
}
