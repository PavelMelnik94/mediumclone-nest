import { Controller } from '@nestjs/common';
import { Body, Get, Post, Req } from '@nestjs/common/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UserResponseInterface } from './types/userResponse.interface';
import { UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { User } from './decorators/user.decorator';
import { UserEntity } from './user.entity';

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('users')
	@UsePipes(new ValidationPipe())
	async createUser(
		@Body('user') createUserDto: CreateUserDto,
	): Promise<UserResponseInterface> {
		const user = await this.userService.createUser(createUserDto);
		return this.userService.buildUserResponse(user);
	}

	@Post('users/login')
	@UsePipes(new ValidationPipe())
	async login(
		@Body('user') loginUserDto: LoginUserDto,
	): Promise<UserResponseInterface> {
		const user = await this.userService.login(loginUserDto);
		return this.userService.buildUserResponse(user);
	}

	@Get('user')
	async getCurrentUser(
		@User() user: UserEntity,
		@User('id') currentUserId: number,
	): Promise<UserResponseInterface> {
		console.log(currentUserId, 'currentUserId');
		return this.userService.buildUserResponse(user);
	}
}
