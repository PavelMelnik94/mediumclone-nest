import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { ProfileType } from './types/profile.type';
import PostgresDataSource from '../config/orm.config';
import { UserEntity } from '../user/user.entity';
import { FollowEntity } from './follow.entity';

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

	async followProfile(
		currentUserId: number,
		profileUserName: string,
	): Promise<ProfileType> {
		const user = await PostgresDataSource.manager.findOne(UserEntity, {
			where: { username: profileUserName },
		});

		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		if (currentUserId === user.id) {
			throw new HttpException(
				'You cannot follow yourself',
				HttpStatus.BAD_REQUEST,
			);
		}

		const follow = await PostgresDataSource.manager.findOne(FollowEntity, {
			where: {
				followerId: currentUserId,
				followingId: user.id,
			},
		});

		if (!follow) {
			const followToCreate = new FollowEntity();
			followToCreate.followerId = currentUserId;
			followToCreate.followingId = user.id;
			await PostgresDataSource.manager.save(followToCreate);
		}
		return { ...user, following: true };
	}

	async unfollowProfile(
		currentUserId: number,
		profileUserName: string,
	): Promise<ProfileType> {
		const user = await PostgresDataSource.manager.findOne(UserEntity, {
			where: { username: profileUserName },
		});

		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		if (currentUserId === user.id) {
			throw new HttpException(
				'You cannot follow yourself',
				HttpStatus.BAD_REQUEST,
			);
		}

		await PostgresDataSource.manager.delete(FollowEntity, {
			followerId: currentUserId,
			followingId: user.id,
		});

		return { ...user, following: false };
	}

	buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
		delete profile.email;
		return { profile };
	}
}
