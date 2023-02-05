import { ConnectionOptions } from 'typeorm';

const ormConfig: ConnectionOptions = {
	type: 'postgres',
	host: process.env.DB_HOST || 'localhost',
	port: Number(process.env.DB_PORT) || 5432,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
};

export default ormConfig;
