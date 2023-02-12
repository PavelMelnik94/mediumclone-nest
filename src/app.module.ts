import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TagModule } from '@app/tag/tag.module';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './user/middlewares/auth.meddleware';

@Module({
	imports: [TagModule, UserModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes({
			path: '*',
			method: RequestMethod.ALL,
		});
	}
}
