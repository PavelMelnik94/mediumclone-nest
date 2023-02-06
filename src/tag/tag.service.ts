import { Injectable } from '@nestjs/common';
import { TagEntity } from './tag.entity';
import PostgresDataSource from '@app/config/orm.config';

@Injectable()
export class TagService {
	async findAll(): Promise<TagEntity[]> {
		return PostgresDataSource.manager.find(TagEntity);
	}
}
