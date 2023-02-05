import { ConnectionOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();
const ormConfig: ConnectionOptions = {
	type: 'postgres',
	host: configService.get('DB_HOST') || 'localhost',
	port: configService.get('DB_PORT') || 5432,
	username: configService.get('DB_USER'),
	password: configService.get('DB_PASSWORD'),
	database: configService.get('DB_NAME'),
	synchronize: true,
	entities: [__dirname + '/../**/*.entity{.ts,.js}'],
};

export default ormConfig;
