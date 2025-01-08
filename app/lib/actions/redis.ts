'use server';

import { get, set, del, keys, ttl, ping, healthCheck } from '../redis';

export async function getRedisValue(key: string) {
  return get(key);
}

export async function setRedisValue(key: string, value: any, options?: { ex?: number }) {
  return set(key, value, options);
}

export async function deleteRedisKey(key: string) {
  return del(key);
}

export async function getRedisKeys(pattern: string) {
  return keys(pattern);
}

export async function getKeyTTL(key: string) {
  return ttl(key);
}

export async function pingRedis() {
  return ping();
}

export async function checkRedisHealth() {
  return healthCheck();
} 