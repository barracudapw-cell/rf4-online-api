import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Получаем все ключи пользователей (префикс "user:")
  const keys = await kv.keys('user:*');
  let count = 0;
  for (const key of keys) {
    const data = await kv.get(key);
    if (data && Date.now() - data.lastSeen <= 60000) {
      count++;
    }
  }
  res.status(200).json({ online: count });
}
