import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthGuard } from './guards/auth.guard';

@Module({
	providers: [UserService, AuthGuard],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}
