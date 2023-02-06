import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('users')
	async createUser(@Body('user') createUserDto: CreateUserDto): Promise<any> {
		return this.userService.createUser(createUserDto);
	}
}
