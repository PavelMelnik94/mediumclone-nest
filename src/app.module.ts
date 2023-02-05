import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagModule } from '@app/tag/tag.module';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';

import ormConfig from './config/orm.config';

@Module({
	imports: [TypeOrmModule.forRoot(ormConfig), TagModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
