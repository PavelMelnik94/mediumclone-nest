import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import PostgresDataSource from '@app/config/orm.config';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/login-user.dto';

const configService = new ConfigService();
@Injectable()
export class UserService {
	async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
		const isEmailAlreadyExist = await PostgresDataSource.manager.findOne(
			UserEntity,
			{
				where: { email: createUserDto.email },
			},
		);

		const isUsernameAlreadyExist = await PostgresDataSource.manager.findOne(
			UserEntity,
			{
				where: { username: createUserDto.username },
			},
		);

		if (isEmailAlreadyExist || isUsernameAlreadyExist) {
			throw new HttpException(
				'Email or username already exist',
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}
		const newUser = new UserEntity();
		Object.assign(newUser, createUserDto);
		return PostgresDataSource.manager.save(newUser);
	}

	generateJWT(user: UserEntity): string {
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

	async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
		const inputUser = await PostgresDataSource.manager.findOne(UserEntity, {
			where: { email: loginUserDto.email },
			select: ['id', 'email', 'username', 'password', 'bio', 'image'],
		});

		if (!inputUser) {
			throw new HttpException(
				'Email or password is wrong',
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}

		const { password: inputPassword } = loginUserDto;
		const { password: existPassword } = inputUser;
		const isPasswordCorrect = await compare(inputPassword, existPassword);

		if (!isPasswordCorrect) {
			throw new HttpException(
				'Email or password is wrong',
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}

		delete inputUser.password;

		return inputUser;
	}

	findById(id: number): Promise<UserEntity> {
		return PostgresDataSource.manager.findOne(UserEntity, {
			where: { id },
		});
	}
}
