export default async function handler(req, res) {
  if (!global.onlineUsers) global.onlineUsers = new Map();
  const now = Date.now();
  let count = 0;
  for (let [id, data] of global.onlineUsers.entries()) {
    if (now - data.lastSeen <= 60000) count++;
  }
  res.status(200).json({ online: count });
}