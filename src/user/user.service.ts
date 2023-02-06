import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import PostgresDataSource from '@app/config/orm.config';
import { UserResponseInterface } from './types/userResponse.interface';

const configService = new ConfigService();
@Injectable()
export class UserService {
	async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
		const newUser = new UserEntity();
		Object.assign(newUser, createUserDto);
		return PostgresDataSource.manager.save(newUser);
	}

	generateJWT(user: UserEntity): string {
		console.log(user);
		return sign(
			{
				id: user.id,
				username: user.username,
				email: user.email,
			},
			configService.get('JWT_SECRET'),
		);
	}

	buildUserResponse(user: UserEntity): UserResponseInterface {
		return {
			user: {
				...user,
				token: this.generateJWT(user),
			},
		};
	}
}
