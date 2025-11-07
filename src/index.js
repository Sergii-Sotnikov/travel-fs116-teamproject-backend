import 'dotenv/config';
import { initMongoConnection } from './db/initMongoDB.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
  await initMongoConnection();
  await setupServer().catch((error) => console.error(error));
};

bootstrap();
