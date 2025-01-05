import { CacheService } from './services/cache.service';

async function testMongoDBConnection() {
  try {
    // Test setting a value
    await CacheService.set('test-key', { message: 'Hello MongoDB!' }, 5);
    console.log('Successfully set test value');

    // Test getting the value
    const value = await CacheService.get('test-key');
    console.log('Retrieved value:', value);

    // Test cleanup
    await CacheService.cleanup();
    console.log('Cleanup completed');

    return 'MongoDB connection test successful!';
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    throw error;
  }
}

export { testMongoDBConnection }; 