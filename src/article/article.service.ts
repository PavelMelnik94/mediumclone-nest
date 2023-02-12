import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleEntity } from './article.entity';
import PostgresDataSource from '@app/config/orm.config';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';
import { DeleteResult } from 'typeorm';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
	async createArticle(
		currentUser: UserEntity,
		createArticleDto: CreateArticleDto,
	): Promise<ArticleEntity> {
		const article = new ArticleEntity();
		Object.assign(article, createArticleDto);

		if (article.tagList) {
			article.tagList = [];
		}

		article.slug = this.getSlug(createArticleDto.title);
		article.author = currentUser;

		return PostgresDataSource.manager.save(article);
	}

	buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
		return { article };
	}

	private getSlug(title: string): string {
		return (
			slugify(title, { lower: true }) +
			'-' +
			((Math.random() * Math.pow(36, 6)) | 0).toString(36)
		);
	}

	async findBySlug(slug: string): Promise<ArticleEntity> {
		return PostgresDataSource.manager.findOne(ArticleEntity, {
			where: { slug },
		});
	}

	async deleteArticle(
		slug: string,
		currentUserId: number,
	): Promise<DeleteResult> {
		const article = await this.findBySlug(slug);

		if (!article) {
			throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
		}

		if (article.author.id !== currentUserId) {
			throw new HttpException(
				'You are not the author of this article',
				HttpStatus.FORBIDDEN,
			);
		}

		return PostgresDataSource.manager.delete(ArticleEntity, {
			slug,
		});
	}

	async updateArticle(
		slug: string,
		updateArticleDto: UpdateArticleDto,
		currentUserId: number,
	): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug);

		if (!article) {
			throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
		}

		if (article.author.id !== currentUserId) {
			throw new HttpException(
				'You are not the author of this article',
				HttpStatus.FORBIDDEN,
			);
		}

		Object.assign(article, updateArticleDto);

		return PostgresDataSource.manager.save(article);
	}
}
