import { Module } from '@nestjs/common';
import { TagModule } from '@app/tag/tag.module';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';

@Module({
	imports: [TagModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
