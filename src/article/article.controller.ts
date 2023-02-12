import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}
	@Post()
	async createArticle() {
		return this.articleService.createArticle();
	}
}
