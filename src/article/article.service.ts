import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleEntity } from './article.entity';
import PostgresDataSource from '@app/config/orm.config';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';
import { DeleteResult } from 'typeorm';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleQueryInterface } from './types/articleQuery.interface';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';

@Injectable()
export class ArticleService {
	async createArticle(
		currentUser: UserEntity,
		createArticleDto: CreateArticleDto,
	): Promise<ArticleEntity> {
		const article = new ArticleEntity();
		Object.assign(article, createArticleDto);

		if (!createArticleDto.tagList.length) article.tagList = [];

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

	async findAll(
		currentUserId: number,
		query: ArticleQueryInterface,
	): Promise<ArticlesResponseInterface> {
		const qb = PostgresDataSource.manager
			.createQueryBuilder(ArticleEntity, 'articles')
			.leftJoinAndSelect('articles.author', 'author');

		const articlesCount = await qb.getCount();

		if (query.tag) {
			qb.andWhere('articles.tagList LIKE :tag', {
				tag: `%${query.tag}%`,
			});
		}

		if (query.favorited) {
			const author = await PostgresDataSource.manager.findOne(UserEntity, {
				where: { username: query.favorited },
				relations: ['favorites'],
			});

			const ids = author.favorites.map((favArticle) => favArticle.id);

			if (ids.length > 0) {
				qb.andWhere('articles.id IN (:...ids)', { ids });
			} else {
				qb.andWhere('1=0');
			}
		}

		if (query.limit) {
			qb.limit(query.limit);
		}

		if (query.offset) {
			qb.offset(query.offset);
		}

		if (query.author) {
			const author = await PostgresDataSource.manager.findOne(UserEntity, {
				where: { username: query.author },
			});
			qb.andWhere('articles.authorId = :id', {
				id: author.id,
			});
		}

		let favoriteArticlesIds: number[] = [];

		if (currentUserId) {
			const currentUser = await PostgresDataSource.manager.findOne(UserEntity, {
				where: { id: currentUserId },
				relations: ['favorites'],
			});

			favoriteArticlesIds = currentUser.favorites.map((f) => f.id);
		}

		const articles = await qb.getMany();
		const articlesWithFavorites = articles.map((article) => {
			const favorited = favoriteArticlesIds.includes(article.id);
			return { ...article, favorited };
		});

		return {
			articles: articlesWithFavorites,
			articlesCount,
		};
	}

	async addArticleToFavorites(
		slug: string,
		currentUserId: number,
	): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug);

		if (!article) {
			throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
		}

		const user = await PostgresDataSource.manager.findOne(UserEntity, {
			where: { id: currentUserId },
			relations: ['favorites'],
		});

		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		const isNotAlreadyExistInFavorite: boolean =
			user.favorites.findIndex(
				(currArticleId) => currArticleId.id === article.id,
			) === -1;

		if (isNotAlreadyExistInFavorite) {
			user.favorites.push(article);
			article.favoritesCount++;
			PostgresDataSource.manager.save(user);
			PostgresDataSource.manager.save(article);
		}

		return article;
	}

	async deleteArticleFromFavorites(
		slug: string,
		currentUserId: number,
	): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug);

		if (!article) {
			throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
		}

		const user = await PostgresDataSource.manager.findOne(UserEntity, {
			where: { id: currentUserId },
			relations: ['favorites'],
		});

		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		const articleIndex = user.favorites.findIndex(
			(currArticle) => currArticle.id === article.id,
		);

		if (articleIndex >= 0) {
			user.favorites.splice(articleIndex, 1);
			article.favoritesCount--;
			PostgresDataSource.manager.save(user);
			PostgresDataSource.manager.save(article);
		}

		return article;
	}
}
