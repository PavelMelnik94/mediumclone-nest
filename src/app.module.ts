import { Module } from '@nestjs/common';
import { TagModule } from '@app/tag/tag.module';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { UserModule } from './user/user.module';

@Module({
	imports: [TagModule, UserModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
