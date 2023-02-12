import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleEntity } from './article.entity';
import PostgresDataSource from '@app/config/orm.config';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';

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
}
