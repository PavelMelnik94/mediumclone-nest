import { Controller } from '@nestjs/common';
import { Body, Post, UseGuards } from '@nestjs/common/decorators';
import { ArticleService } from './article.service';
import { AuthGuard } from '../user/guards/auth.guard';
import { UserEntity } from '../user/user.entity';
import { User } from '../user/decorators/user.decorator';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('article')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@Post()
	@UseGuards(AuthGuard)
	async create(
		@User() currentUser: UserEntity,
		@Body('article') createArticleDto: CreateArticleDto,
	): Promise<any> {
		return this.articleService.createArticle(currentUser, createArticleDto);
	}
}
