import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

const SeedPostgresDataSource = new DataSource({
	type: 'postgres',
	host: configService.get('DB_HOST') || 'localhost',
	port: configService.get('DB_PORT') || 5432,
	username: configService.get('DB_USER'),
	password: configService.get('DB_PASSWORD'),
	database: configService.get('DB_NAME'),
	synchronize: false,
	entities: [__dirname + '/../**/*.entity{.ts,.js}'],
	migrations: [__dirname + '/../seeds/**/*{.ts,.js}'],
});

SeedPostgresDataSource.initialize()
	.then(() => {
		console.log('Data Source has been initialized!');
	})
	.catch((err) => {
		console.error('Error during Data Source initialization', err);
	});

export default SeedPostgresDataSource;
