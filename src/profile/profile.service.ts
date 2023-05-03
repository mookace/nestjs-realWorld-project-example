import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { slugify } from '../shared/other-helper';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>
  ) {}

  //get One with id
  async findOneId(user_id: number): Promise<ProfileEntity> {
    const data = await this.profileRepository.findOne({
      where: {
        is_deleted: false,
        user_id: user_id,
      },
    });
    if (!data) {
      throw new HttpException(
        {
          msg: 'Data Not Found',
          errors: { msg: `Data Not Found` },
          status: 'errors',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    return data;
  }

  // update Profile
  async update(
    user_id: number,
    userData: UpdateProfileDto
  ): Promise<ProfileEntity> {
    let toUpdate = await this.profileRepository.findOne({
      where: { user_id: user_id, is_deleted: false },
    });

    if (!toUpdate.slug) {
      toUpdate.slug = slugify('profile');
    }

    toUpdate.updated_at = new Date();
    const updateProfile = Object.assign(toUpdate, userData);
    const saveData = await this.profileRepository.save(updateProfile);
    return saveData;
  }
}
