import 'dotenv/config';
import { initMongoConnection } from './db/initMongoDB.js';
import { setupServer } from './server.js';

async function bootstrap() {
  console.log('🚀 Bootstrap started');

  await initMongoConnection();
  console.log('✅ Mongo connection initialized');

  await setupServer();
  console.log('✅ Server setup finished');
}

bootstrap().catch((error) => {
  console.error('❌ Fatal error in bootstrap:', error);
  process.exit(1);
});
