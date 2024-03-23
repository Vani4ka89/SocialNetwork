import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/types/user-data.type';
import { FollowRepository } from '../../repository/services/follow.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateUserRequestDto } from '../models/dto/request/update-user.request.dto';
import { ResponseUserDto } from '../models/dto/response/response-user.dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followRepository: FollowRepository,
  ) {}

  public async findMe(userData: IUserData): Promise<ResponseUserDto> {
    const entity = await this.userRepository.findOneBy({ id: userData.userId });
    return UserMapper.toResponseDto(entity);
  }

  public async updateMe(
    userData: IUserData,
    dto: UpdateUserRequestDto,
  ): Promise<ResponseUserDto> {
    const entity = await this.userRepository.findOneBy({ id: userData.userId });
    const user = await this.userRepository.save({ ...entity, ...dto });
    return UserMapper.toResponseDto(user);
  }

  public async getPublicUser(userId: string): Promise<ResponseUserDto> {
    const entity = await this.findByIdOrThrow(userId);
    return UserMapper.toResponseDto(entity);
  }

  public async follow(userId: string, userData: IUserData): Promise<void> {
    if (userData.userId === userId) {
      throw new ConflictException('You cant follow yourself');
    }
    const entity = await this.findByIdOrThrow(userId);
    const follow = await this.followRepository.findOneBy({
      follower_id: userData.userId,
      following_id: entity.id,
    });
    if (follow) {
      throw new ConflictException('You already follow this user');
    }
    await this.followRepository.save(
      this.followRepository.create({
        follower_id: userData.userId,
        following_id: entity.id,
      }),
    );
  }

  public async unfollow(userId: string, userData: IUserData): Promise<void> {
    const user = await this.findByIdOrThrow(userId);
    const follow = await this.followRepository.findOneBy({
      follower_id: userData.userId,
      following_id: user.id,
    });
    if (!follow) {
      throw new ConflictException('You cant unfollow this user');
    }
    await this.followRepository.delete({
      follower_id: userData.userId,
      following_id: userId,
    });
  }

  public async findByIdOrThrow(userId: string): Promise<UserEntity> {
    const entity = await this.userRepository.findOneBy({ id: userId });
    if (!entity) {
      throw new UnprocessableEntityException();
    }
    return entity;
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException();
    }
  }
}
