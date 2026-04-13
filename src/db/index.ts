import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// ビルド時ではなくリクエスト時にDB接続を初期化
function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  const sql = neon(process.env.DATABASE_URL)
  return drizzle(sql, { schema })
}

export { getDb }
export type DB = ReturnType<typeof getDb>
