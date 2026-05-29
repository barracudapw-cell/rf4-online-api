export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { user_id, app_version } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id required' });
  }
  // Используем глобальный объект для хранения (в Vercel он сбрасывается между вызовами,
  // для продакшена нужна база данных, но для демо и небольшой нагрузки сойдёт)
  if (!global.onlineUsers) global.onlineUsers = new Map();
  const now = Date.now();
  global.onlineUsers.set(user_id, { lastSeen: now, app_version: app_version || '1.6.0' });
  // Чистим старых (старше 60 секунд)
  for (let [id, data] of global.onlineUsers.entries()) {
    if (now - data.lastSeen > 60000) global.onlineUsers.delete(id);
  }
  res.status(200).json({ status: 'ok' });
}