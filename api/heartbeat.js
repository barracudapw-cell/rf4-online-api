import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { user_id, app_version } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id required' });
  }
  const now = Date.now();
  // Сохраняем время последнего heartbeat
  await kv.set(`user:${user_id}`, { lastSeen: now, app_version: app_version || '1.6.0' });
  // Устанавливаем срок жизни ключа 60 секунд
  await kv.expire(`user:${user_id}`, 60);
  res.status(200).json({ status: 'ok' });
}
