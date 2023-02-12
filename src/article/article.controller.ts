import { Controller, Delete } from '@nestjs/common';
import {
	Body,
	Post,
	UseGuards,
	Get,
	Put,
	UsePipes,
} from '@nestjs/common/decorators';
import { ArticleService } from './article.service';
import { AuthGuard } from '../user/guards/auth.guard';
import { UserEntity } from '../user/user.entity';
import { User } from '../user/decorators/user.decorator';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import {
	Param,
	Query,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ArticleQueryInterface } from './types/articleQuery.interface';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';

@Controller('articles')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@Get()
	async findAll(
		@User('id') currentUserId: number,
		@Query() query: ArticleQueryInterface,
	): Promise<ArticlesResponseInterface> {
		return await this.articleService.findAll(currentUserId, query);
	}

	@Post()
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	async create(
		@User() currentUser: UserEntity,
		@Body('article') createArticleDto: CreateArticleDto,
	): Promise<ArticleResponseInterface> {
		const article = await this.articleService.createArticle(
			currentUser,
			createArticleDto,
		);

		return this.articleService.buildArticleResponse(article);
	}

	@Get(':slug')
	async getArticle(
		@Param('slug') slug: string,
	): Promise<ArticleResponseInterface> {
		const article = await this.articleService.findBySlug(slug);

		return this.articleService.buildArticleResponse(article);
	}

	@Delete(':slug')
	@UseGuards(AuthGuard)
	async deleteArticle(
		@User('id') currentUserId: number,
		@Param('slug') slug: string,
	) {
		return await this.articleService.deleteArticle(slug, currentUserId);
	}

	@Put(':slug')
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	async updateArticle(
		@User('id') currentUserId: number,
		@Body('article') updateArticleDto: UpdateArticleDto,
		@Param('slug') slug: string,
	): Promise<ArticleResponseInterface> {
		const article = await this.articleService.updateArticle(
			slug,
			updateArticleDto,
			currentUserId,
		);

		return this.articleService.buildArticleResponse(article);
	}
}
