import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import PostgresDataSource from '@app/config/orm.config';

@Injectable()
export class UserService {
	async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
		const newUser = new UserEntity();
		Object.assign(newUser, createUserDto);
		return PostgresDataSource.manager.save(newUser);
	}
}
