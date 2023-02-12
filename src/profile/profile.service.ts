import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { ProfileType } from './types/profile.type';
import PostgresDataSource from '../config/orm.config';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class ProfileService {
	async getProfile(
		currentUserId: number,
		profileUserName: string,
	): Promise<ProfileType> {
		const user = await PostgresDataSource.manager.findOne(UserEntity, {
			where: { username: profileUserName },
		});

		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		return {
			...user,
			following: false,
		};
	}

	buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
		delete profile.email;
		return { profile };
	}
}
