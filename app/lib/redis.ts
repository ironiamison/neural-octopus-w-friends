import { Redis } from '@upstash/redis'

type RedisValue = string | null;

interface MockRedisClient {
  get(key: string): Promise<RedisValue>;
  set(key: string, value: string, options?: { ex?: number }): Promise<'OK'>;
  ping(): Promise<'PONG'>;
  del(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  ttl(key: string): Promise<number>;
}

// In-memory store for mock client
const mockStore = new Map<string, { value: string; expiresAt?: number }>();

// Initialize Redis client
const getClient = (): Redis | MockRedisClient => {
  if (typeof window !== 'undefined') {
    throw new Error('Redis client cannot be instantiated on the client side');
  }

  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const url = process.env.UPSTASH_REDIS_REST_URL;

  // Return mock client if Redis is not configured or if we're in development mode
  if (!token || !url || process.env.NODE_ENV === 'development') {
    console.warn('Using mock Redis client');
    return {
      get: async (key: string): Promise<RedisValue> => {
        const item = mockStore.get(key);
        if (!item) return null;
        if (item.expiresAt && item.expiresAt < Date.now()) {
          mockStore.delete(key);
          return null;
        }
        return item.value;
      },
      set: async (key: string, value: string, options?: { ex?: number }): Promise<'OK'> => {
        const expiresAt = options?.ex ? Date.now() + options.ex * 1000 : undefined;
        mockStore.set(key, { value, expiresAt });
        return 'OK';
      },
      ping: async (): Promise<'PONG'> => 'PONG',
      del: async (key: string): Promise<number> => {
        return mockStore.delete(key) ? 1 : 0;
      },
      keys: async (pattern: string): Promise<string[]> => {
        return Array.from(mockStore.keys()).filter(key => 
          key.includes(pattern.replace('*', ''))
        );
      },
      ttl: async (key: string): Promise<number> => {
        const item = mockStore.get(key);
        if (!item || !item.expiresAt) return -1;
        return Math.ceil((item.expiresAt - Date.now()) / 1000);
      }
    };
  }

  try {
    console.log('Creating Redis client...');
    const client = new Redis({
      url,
      token
    });
    console.log('Redis client created successfully');
    return client;
  } catch (error) {
    console.error('Failed to initialize Redis client:', error);
    // Return mock client on error
    return {
      get: async (key: string): Promise<RedisValue> => {
        const item = mockStore.get(key);
        if (!item) return null;
        if (item.expiresAt && item.expiresAt < Date.now()) {
          mockStore.delete(key);
          return null;
        }
        return item.value;
      },
      set: async (key: string, value: string, options?: { ex?: number }): Promise<'OK'> => {
        const expiresAt = options?.ex ? Date.now() + options.ex * 1000 : undefined;
        mockStore.set(key, { value, expiresAt });
        return 'OK';
      },
      ping: async (): Promise<'PONG'> => 'PONG',
      del: async (key: string): Promise<number> => {
        return mockStore.delete(key) ? 1 : 0;
      },
      keys: async (pattern: string): Promise<string[]> => {
        return Array.from(mockStore.keys()).filter(key => 
          key.includes(pattern.replace('*', ''))
        );
      },
      ttl: async (key: string): Promise<number> => {
        const item = mockStore.get(key);
        if (!item || !item.expiresAt) return -1;
        return Math.ceil((item.expiresAt - Date.now()) / 1000);
      }
    };
  }
};

// Singleton instance
let redisClient: Redis | MockRedisClient | null = null;

export function getRedisClient(): Redis | MockRedisClient {
  if (!redisClient) {
    console.log('Getting Redis client...');
    redisClient = getClient();
    console.log('Redis client initialized');
  }
  return redisClient;
}

// Redis operations with better error handling
export async function get(key: string): Promise<RedisValue> {
  const client = getRedisClient();
  try {
    const result = await client.get<string>(key);
    return result;
  } catch (error) {
    console.error(`Redis GET operation failed for key ${key}:`, error);
    return null;
  }
}

export async function set(key: string, value: string, options?: { ex?: number }): Promise<'OK' | null> {
  const client = getRedisClient();
  try {
    if (options?.ex) {
      const result = await client.set(key, value, { ex: options.ex });
      return result === 'OK' ? 'OK' : null;
    }
    const result = await client.set(key, value);
    return result === 'OK' ? 'OK' : null;
  } catch (error) {
    console.error(`Redis SET operation failed for key ${key}:`, error);
    return null;
  }
}

export async function del(key: string): Promise<number> {
  const client = getRedisClient();
  try {
    return await client.del(key);
  } catch (error) {
    console.error(`Redis DEL operation failed for key ${key}:`, error);
    return 0;
  }
}

export async function keys(pattern: string): Promise<string[]> {
  const client = getRedisClient();
  try {
    return await client.keys(pattern);
  } catch (error) {
    console.error(`Redis KEYS operation failed for pattern ${pattern}:`, error);
    return [];
  }
}

export async function ttl(key: string): Promise<number> {
  const client = getRedisClient();
  try {
    return await client.ttl(key);
  } catch (error) {
    console.error(`Redis TTL operation failed for key ${key}:`, error);
    return -2;
  }
}

export async function ping(): Promise<'PONG' | 'FAILED'> {
  const client = getRedisClient();
  try {
    console.log('Pinging Redis...');
    const result = await client.ping();
    console.log('Ping response:', result);
    return result === 'PONG' ? 'PONG' : 'FAILED';
  } catch (error) {
    console.error('Redis PING operation failed:', error);
    return 'FAILED';
  }
}

export async function testConnection() {
  try {
    console.log('Starting Redis connection test...');
    const client = getRedisClient();
    console.log('Testing Redis connection...');
    
    // First test ping
    console.log('Testing ping...');
    const pingResult = await ping();
    console.log('Ping result:', pingResult);
    if (pingResult !== 'PONG') {
      throw new Error('Redis ping failed');
    }

    const testKey = 'test-connection';
    
    // Test set
    console.log('Testing set...');
    const setResult = await set(testKey, 'working', { ex: 60 });
    console.log('Set result:', setResult);
    if (setResult !== 'OK') {
      throw new Error('Redis set failed');
    }
    
    // Test get
    console.log('Testing get...');
    const getResult = await get(testKey);
    console.log('Get result:', getResult);
    if (getResult !== 'working') {
      throw new Error('Redis get failed');
    }
    
    // Test delete
    console.log('Testing delete...');
    const delResult = await del(testKey);
    console.log('Delete result:', delResult);
    if (delResult !== 1) {
      throw new Error('Redis delete failed');
    }
    
    return {
      success: true,
      message: 'Redis connection test successful',
      value: getResult
    };
  } catch (error) {
    console.error('Redis connection test failed:', error);
    return {
      success: false,
      message: 'Redis connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 